import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { PoolRequestApi, SandboxInstanceApi } from 'kypo-sandbox-api';
import { SandboxInstance } from 'kypo-sandbox-model';
import { BehaviorSubject, EMPTY, from, merge, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxNavigator } from '../client/sandbox-navigator.service';
import { SandboxNotificationService } from '../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { SandboxInstancePollingService } from './sandbox-instance-polling.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can get sandbox instances and perform various operations to modify them.
 */
@Injectable()
export class SandboxInstanceConcreteService extends SandboxInstancePollingService {
  private manuallyUpdatedInstances$: BehaviorSubject<KypoPaginatedResource<SandboxInstance>>;

  constructor(
    private sandboxApi: SandboxInstanceApi,
    private requestApi: PoolRequestApi,
    private router: Router,
    private dialog: MatDialog,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
    this.manuallyUpdatedInstances$ = new BehaviorSubject(this.initSubject(context.config.defaultPaginationSize));
    this.resource$ = merge(this.poll$, this.manuallyUpdatedInstances$.asObservable());
  }

  /**
   * Gets all sandbox instances with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with sandbox instances
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: KypoRequestedPagination): Observable<KypoPaginatedResource<SandboxInstance>> {
    this.onManualGetAll(poolId, pagination);
    return this.sandboxApi.getSandboxes(poolId, pagination).pipe(
      tap(
        (paginatedInstances) => {
          this.manuallyUpdatedInstances$.next(paginatedInstances);
        },
        (err) => this.onGetAllError(err)
      )
    );
  }

  /**
   * Deletes a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param sandboxInstance a sandbox instance to be deleted
   */
  delete(sandboxInstance: SandboxInstance): Observable<any> {
    return this.displayConfirmationDialog(sandboxInstance, 'Delete').pipe(
      switchMap((result) =>
        result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToDelete(sandboxInstance) : EMPTY
      )
    );
  }

  /**
   * Starts an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param poolId id of a pool in which the allocation will take place
   */
  allocate(poolId: number): Observable<any> {
    return this.sandboxApi.allocateSandboxes(poolId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Allocation of pool ${poolId} started`),
        (err) => this.errorHandler.emit(err, `Allocating pool ${poolId}`)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Unlocks a sandbox instance making it available for modification.
   * Informs about the result and updates list of requests or handles an error
   * @param sandboxInstance a sandbox instance to be unlocked
   */
  unlock(sandboxInstance: SandboxInstance): Observable<any> {
    return this.displayConfirmationDialog(sandboxInstance, 'Unlock').pipe(
      switchMap((result) =>
        result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToUnlock(sandboxInstance) : EMPTY
      )
    );
  }

  /**
   * Lock a sandbox instance making it unavailable for modification and save for usage.
   * Informs about the result and updates list of requests or handles an error
   * @param sandboxInstance a sandbox instance to be locked
   */
  lock(sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxApi.lockSandbox(sandboxInstance.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Sandbox ${sandboxInstance.id} was locked`),
        (err) => this.errorHandler.emit(err, `Locking sandbox ${sandboxInstance.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  showTopology(poolId: number, sandboxInstance: SandboxInstance): Observable<any> {
    return from(this.router.navigate([this.navigator.toSandboxInstanceTopology(poolId, sandboxInstance.id)]));
  }

  protected repeatLastGetAll(): Observable<KypoPaginatedResource<SandboxInstance>> {
    this.hasErrorSubject$.next(false);
    return this.sandboxApi
      .getSandboxes(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private displayConfirmationDialog(
    sandboxInstance: SandboxInstance,
    action: string
  ): Observable<CsirtMuDialogResultEnum> {
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {
      data: new CsirtMuConfirmationDialogConfig(
        `${action} sandbox`,
        `Do you want to ${action} sandbox ${sandboxInstance.id}"?`,
        'Cancel',
        action
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToUnlock(sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxApi.unlockSandbox(sandboxInstance.id, sandboxInstance.lockId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Sandbox${sandboxInstance.id} was unlocked`),
        (err) => this.errorHandler.emit(err, `Unlocking sandbox ${sandboxInstance.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToDelete(sandboxInstance: SandboxInstance): Observable<any> {
    return this.requestApi.createCleanupRequest(sandboxInstance.allocationUnitId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Sandbox ${sandboxInstance.id} was deleted`),
        (err) => this.errorHandler.emit(err, `Deleting sandbox ${sandboxInstance.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching sandbox instances');
    this.hasErrorSubject$.next(true);
  }
}
