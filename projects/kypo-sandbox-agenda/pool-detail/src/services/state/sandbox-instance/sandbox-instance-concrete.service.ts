import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common';
import { PoolApi, SandboxAllocationUnitsApi, SandboxInstanceApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxAllocationUnit, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { SandboxInstanceService } from './sandbox-instance.service';
import { SandboxAllocationUnitsService } from '../sandbox-allocation-unit/sandbox-allocation-units.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can get sandbox instances and perform various operations to modify them.
 */
@Injectable()
export class SandboxInstanceConcreteService extends SandboxInstanceService {
  private lastPoolId: number;
  private lastOffsetPagination: OffsetPaginationEvent;

  constructor(
    private sandboxApi: SandboxInstanceApi,
    private poolApi: PoolApi,
    private sandboxAllocationUnitsApi: SandboxAllocationUnitsApi,
    private allocationUnitsService: SandboxAllocationUnitsService,
    private router: Router,
    private dialog: MatDialog,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
    this.allocationUnits$ = allocationUnitsService.units$;
  }

  /**
   * Gets all sandbox instances with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with sandbox instances
   * @param pagination requested pagination
   */
  getAllSandboxes(poolId: number, pagination: OffsetPaginationEvent): Observable<PaginatedResource<SandboxInstance>> {
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

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  getAllUnits(poolId: number, pagination: OffsetPaginationEvent): Observable<PaginatedResource<SandboxAllocationUnit>> {
    this.lastOffsetPagination = pagination;
    this.lastPoolId = poolId;
    return this.allocationUnitsService.getAll(poolId, pagination);
  }

  /**
   * Deletes a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param sandboxInstance a sandbox instance to be deleted
   */
  delete(sandboxInstance: SandboxInstance): Observable<any> {
    return this.displayConfirmationDialog(sandboxInstance.id, 'Delete').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(sandboxInstance) : EMPTY
      )
    );
  }

  /**
   * Starts an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param poolId id of a pool in which the allocation will take place
   */
  allocate(poolId: number): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return this.poolApi.allocateSandboxes(poolId).pipe(
      tap(
        () => this.notificationService.emit('success', `Allocation of pool ${poolId} started`),
        (err) => this.errorHandler.emit(err, `Allocating pool ${poolId}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Retries an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param unitId id of a unit for which retry will be performed
   */
  retryAllocate(unitId: number): Observable<any> {
    return this.sandboxAllocationUnitsApi.createRetryRequest(unitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Allocation of sandbox ${unitId} started`),
        (err) => this.errorHandler.emit(err, `Allocating sandbox ${unitId}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Unlocks a sandbox instance making it available for modification.
   * Informs about the result and updates list of requests or handles an error
   * @param allocationUnitId a sandbox instance to be unlocked represented by its id
   */
  unlock(allocationUnitId: number): Observable<any> {
    return this.displayConfirmationDialog(allocationUnitId, 'Unlock').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToUnlock(allocationUnitId) : EMPTY
      )
    );
  }

  /**
   * Lock a sandbox instance making it unavailable for modification and save for usage.
   * Informs about the result and updates list of requests or handles an error
   * @param allocationUnitId a sandbox instance to be unlocked represented by its id
   */
  lock(allocationUnitId: number): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return this.sandboxApi.lockSandbox(allocationUnitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Sandbox ${allocationUnitId} was locked`),
        (err) => this.errorHandler.emit(err, `Locking sandbox ${allocationUnitId}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
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

  /**
   * Redirects to topology associated with given allocation unit of the given pool
   * @param poolId id of the pool
   * @param allocationUnitId id of the allocation unit
   */
  showTopology(poolId: number, allocationUnitId: number): Observable<boolean> {
    return from(this.router.navigate([this.navigator.toSandboxInstanceTopology(poolId, allocationUnitId)]));
  }

  /**
   * Starts cleanup for multiple sandboxes specified in @unitIds. If left as empty array deletes
   * all allocation units in pool identified by @poolId
   * @param poolId id of pool for which the cleanup request of units is created
   * @param unitIds array of allocation unit ids which should be deleted
   * @param force when set to true force delete is used
   */
  cleanupMultiple(poolId: number, unitIds: number[], force: boolean): Observable<any> {
    return this.allocationUnitsService
      .cleanupMultiple(poolId, unitIds, force)
      .pipe(switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination)));
  }

  /**
   * Starts cleanup for sandbox specified in @unitIds.
   * @param unitId allocation unit id which should be deleted
   */
  createCleanup(unitId: number): Observable<any> {
    return this.sandboxAllocationUnitsApi.createCleanupRequest(unitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Sandbox ${unitId} was deleted`),
        (err) => this.errorHandler.emit(err, `Deleting sandbox ${unitId}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Redirects to desired detail of stage of the allocation unit.
   * @param poolId id of the pool
   * @param sandboxId id of allocation unit
   * @param stageOrder order of desired stage
   */
  navigateToStage(poolId: number, sandboxId: number, stageOrder: number): Observable<boolean> {
    let path;
    switch (stageOrder) {
      case 0:
      case 1:
      case 2:
        path = this.navigator.toAllocationRequest(poolId, sandboxId);
        break;
      default:
        path = '';
    }
    return path !== '' ? from(this.router.navigate([path], { fragment: `stage-${stageOrder}` })) : of(false);
  }

  protected onManualResourceRefresh(pagination: OffsetPaginationEvent, ...params: any[]): void {
    super.onManualResourceRefresh(pagination);
    this.lastPoolId = params[0];
  }

  protected refreshResource(): Observable<PaginatedResource<SandboxInstance>> {
    this.hasErrorSubject$.next(false);
    return this.sandboxApi
      .getSandboxes(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private displayConfirmationDialog(allocationUnitId: number, action: string): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        `${action} sandbox`,
        `Do you want to ${action} sandbox ${allocationUnitId}"?`,
        'Cancel',
        action
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToUnlock(allocationUnitId: number): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return this.sandboxApi.unlockSandbox(allocationUnitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Sandbox ${allocationUnitId} was unlocked`),
        (err) => this.errorHandler.emit(err, `Unlocking sandbox ${allocationUnitId}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToDelete(sandboxInstance: SandboxInstance): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return this.sandboxAllocationUnitsApi.createCleanupRequest(sandboxInstance.allocationUnitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Sandbox ${sandboxInstance.id} was deleted`),
        (err) => this.errorHandler.emit(err, `Deleting sandbox ${sandboxInstance.id}`)
      ),
      switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching sandbox instances');
    this.hasErrorSubject$.next(true);
  }
}
