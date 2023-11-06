import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common/pagination';
import { PoolApi, SandboxAllocationUnitsApi, SandboxInstanceApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxAllocationUnit, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { SandboxInstanceService } from './sandbox-instance.service';
import { SandboxAllocationUnitsService } from '../sandbox-allocation-unit/sandbox-allocation-units.service';
import { AllocateVariableSandboxesDialogComponent } from '../../../components/allocate-variable-sandboxes/allocate-variable-sandboxes-dialog.component';
import { AllocateVariableSandboxesDialogResult } from '../../../components/allocate-variable-sandboxes/allocateVariableSandboxesDialogResult';

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
   * @param count final number of sandboxes for allocation
   */
  allocate(poolId: number, count: number): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return this.poolApi.allocateSandboxes(poolId, count).pipe(
      tap(
        () => this.notificationService.emit('success', `Allocation of pool ${poolId} started`),
        (err) => this.errorHandler.emit(err, `Allocating pool ${poolId}`)
      ),
      switchMap(() => {
        this.lastPoolId = this.lastPoolId ?? poolId;
        return this.getAllUnits(this.lastPoolId, this.lastPagination);
      })
    );
  }

  /**
   * Starts an allocation of specified number of sandboxes of a sandbox instance,
   * informs about the result and updates list of requests or handles an error
   * @param poolId id of a pool in which the allocation will take place
   * @param total maximum number of sandboxes that are left to allocate
   */
  allocateSpecified(poolId: number, total: number): Observable<PaginatedResource<SandboxAllocationUnit>> {
    return total == 1
      ? this.allocate(poolId, 1) // if there is a request for a single sandbox, skip the dialog
      : this.getNumberOfSandboxes(total).pipe(
          // otherwise, ask for specification of the number of allocated sandboxes
          switchMap((result) => (result.result !== null ? this.allocate(poolId, result.result) : EMPTY))
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
   * @param sandboxUuid id of the sandbox for which remote ssh access is demanded
   */
  getUserSshAccess(sandboxUuid: string): Observable<boolean> {
    return this.sandboxApi.getUserSshAccess(sandboxUuid).pipe(
      catchError((err) => {
        this.errorHandler.emit(err, `User SSH Access for sandbox: ${sandboxUuid}`);
        return EMPTY;
      })
    );
  }

  /**
   * Redirects to topology associated with given allocation unit of the given pool
   * @param poolId id of the pool
   * @param sandboxUuid uuid of the sandbox
   */
  showTopology(poolId: number, sandboxUuid: string): Observable<boolean> {
    return from(this.router.navigate([this.navigator.toSandboxInstanceTopology(poolId, sandboxUuid)]));
  }

  /**
   * Starts cleanup for all allocation units in pool identified by @poolId
   * @param poolId id of pool for which the cleanup request of units is created
   * @param force when set to true force delete is used
   */
  cleanupMultiple(poolId: number, force: boolean): Observable<any> {
    return this.allocationUnitsService
      .cleanupMultiple(poolId, force)
      .pipe(switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination)));
  }

  /**
   * Starts cleanup requests for all failed allocation requests for pool specified by @poolId.
   * @param poolId id of pool for which the cleanup request of units is created
   * @param force when set to true force delete is used
   */
  cleanupFailed(poolId: number, force: boolean): Observable<any> {
    return this.allocationUnitsService
      .cleanupFailed(poolId, force)
      .pipe(switchMap(() => this.getAllUnits(this.lastPoolId, this.lastPagination)));
  }

  /**
   * Starts cleanup requests for all unlocked allocation requests for pool specified by @poolId.
   * @param poolId id of pool for which the cleanup request of units is created
   * @param force when set to true force delete is used
   */
  cleanupUnlocked(poolId: number, force: boolean): Observable<any> {
    return this.allocationUnitsService
      .cleanupUnlocked(poolId, force)
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

  private getNumberOfSandboxes(maximum: number): Observable<AllocateVariableSandboxesDialogResult> {
    const dialogRef = this.dialog.open(AllocateVariableSandboxesDialogComponent, {
      data: maximum,
      width: 'auto',
      height: 'auto',
    });
    return dialogRef.afterClosed();
  }

  private displayConfirmationDialog(id: number | string, action: string): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        `${action} sandbox`,
        `Do you want to ${action} sandbox ${id}"?`,
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
