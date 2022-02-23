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
import { PoolApi, SandboxAllocationUnitsApi, SandboxInstanceApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, from, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
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

  protected onManualResourceRefresh(pagination: RequestedPagination, ...params: any[]): void {
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
        () => this.notificationService.emit('success', `Allocation of pool ${poolId} started`),
        (err) => this.errorHandler.emit(err, `Allocating pool ${poolId}`)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Retries an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param unitId id of a unit for which retry will be performed
   */
  retryAllocate(unitId: number): Observable<PaginatedResource<SandboxInstance>> {
    return this.sandboxAllocationUnitsApi.createRetryRequest(unitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Allocation of sandbox ${unitId} started`),
        (err) => this.errorHandler.emit(err, `Allocating sandbox ${unitId}`)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
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
        () => this.notificationService.emit('success', `Sandbox ${sandboxInstance.id} was locked`),
        (err) => this.errorHandler.emit(err, `Locking sandbox ${sandboxInstance.id}`)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Gets zip file that contains configurations, key and script for remote ssh access for user
   * @param sandboxId id of the sandbox for which remote ssh access is demanded
   */
  getUserSshAccess(sandboxId: number): Observable<boolean> {
    return this.sandboxApi.getUserSshAccess(sandboxId).pipe(
      catchError((err) => {
        this.errorHandler.emit(err, `Management SSH Access for pool: ${sandboxId}`);
        return EMPTY;
      })
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
        () => this.notificationService.emit('success', `Sandbox${sandboxInstance.id} was unlocked`),
        (err) => this.errorHandler.emit(err, `Unlocking sandbox ${sandboxInstance.id}`)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToDelete(sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxAllocationUnitsApi.createCleanupRequest(sandboxInstance.allocationUnitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Sandbox ${sandboxInstance.id} was deleted`),
        (err) => this.errorHandler.emit(err, `Deleting sandbox ${sandboxInstance.id}`)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching sandbox instances');
    this.hasErrorSubject$.next(true);
  }
}
