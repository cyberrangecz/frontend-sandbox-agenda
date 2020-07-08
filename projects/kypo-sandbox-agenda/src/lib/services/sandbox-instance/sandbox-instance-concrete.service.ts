import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { PoolApi, SandboxAllocationUnitsApi, SandboxInstanceApi } from 'kypo-sandbox-api';
import { SandboxInstance } from 'kypo-sandbox-model';
import { EMPTY, from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxNavigator } from '../client/sandbox-navigator.service';
import { SandboxNotificationService } from '../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { SandboxInstanceService } from './sandbox-instance.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can get sandbox instances and perform various operations to modify them.
 */
@Injectable()
export class SandboxInstanceConcreteService extends SandboxInstanceService {
  private lastPoolId: number;

  constructor(
    private sandboxApi: SandboxInstanceApi,
    private poolApi: PoolApi,
    private sandboxAllocationUnitsApi: SandboxAllocationUnitsApi,
    private router: Router,
    private dialog: MatDialog,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }

  /**
   * Gets all sandbox instances with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with sandbox instances
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: RequestedPagination): Observable<PaginatedResource<SandboxInstance>> {
    this.onManualResourceRefresh(pagination, poolId);
    return this.sandboxApi.getSandboxes(poolId, pagination).pipe(
      tap(
        (paginatedInstances) => {
          this.resourceSubject$.next(paginatedInstances);
        },
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected onManualResourceRefresh(pagination: RequestedPagination, ...params: any[]) {
    super.onManualResourceRefresh(pagination);
    this.lastPoolId = params[0];
  }

  /**
   * Deletes a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param sandboxInstance a sandbox instance to be deleted
   */
  delete(sandboxInstance: SandboxInstance): Observable<any> {
    return this.displayConfirmationDialog(sandboxInstance, 'Delete').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(sandboxInstance) : EMPTY
      )
    );
  }

  /**
   * Starts an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param poolId id of a pool in which the allocation will take place
   */
  allocate(poolId: number): Observable<any> {
    return this.poolApi.allocateSandboxes(poolId).pipe(
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
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToUnlock(sandboxInstance) : EMPTY
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

  protected refreshResource(): Observable<PaginatedResource<SandboxInstance>> {
    this.hasErrorSubject$.next(false);
    return this.sandboxApi
      .getSandboxes(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private displayConfirmationDialog(
    sandboxInstance: SandboxInstance,
    action: string
  ): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
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
    return this.sandboxAllocationUnitsApi.createCleanupRequest(sandboxInstance.allocationUnitId).pipe(
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
