import { Injectable } from '@angular/core';
import { SandboxAllocationUnitsService } from './sandbox-allocation-units.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { OffsetPagination, OffsetPaginationEvent, PaginatedResource } from '@sentinel/common';
import { AllocationRequestsApi, PoolApi, SandboxAllocationUnitsApi } from '@muni-kypo-crp/sandbox-api';
import { Request, SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';
import { SandboxErrorHandler, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { ResourcePollingService } from '@muni-kypo-crp/sandbox-agenda/internal';

@Injectable()
export class SandboxAllocationUnitsConcreteService extends SandboxAllocationUnitsService {
  private lastPoolId: number;
  private poolPeriod: number;
  private retryAttempts: number;

  constructor(
    private poolApi: PoolApi,
    private sauApi: SandboxAllocationUnitsApi,
    private allocationRequestsApi: AllocationRequestsApi,
    private resourcePollingService: ResourcePollingService,
    private dialog: MatDialog,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
    this.unitsSubject$ = new BehaviorSubject(this.initSubject(10));
    this.poolPeriod = context.config.pollingPeriod;
    this.retryAttempts = context.config.retryAttempts;
    this.units$ = this.unitsSubject$.asObservable();
  }

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: OffsetPaginationEvent): Observable<PaginatedResource<SandboxAllocationUnit>> {
    this.lastPagination = pagination;
    this.lastPoolId = poolId;
    const observable$: Observable<PaginatedResource<SandboxAllocationUnit>> = this.poolApi
      .getPoolsSandboxAllocationUnits(poolId, pagination)
      .pipe(tap((paginatedRequests) => this.unitsSubject$.next(paginatedRequests)));
    return this.resourcePollingService.startPolling(observable$, this.poolPeriod, this.retryAttempts).pipe(
      tap(
        (_) => _,
        (err) => this.onGetAllError(err)
      )
    );
  }

  /**
   * Starts cleanup requests for all allocation units in a given pool specified by @poolId.
   * @param poolId id of pool for which the cleanup requests are created
   * @param force when set to true force delete is used
   */
  cleanupMultiple(poolId: number, force: boolean): Observable<any> {
    return this.displayConfirmationDialog(poolId, 'Create').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCleanupMultiple(poolId, force) : EMPTY
      )
    );
  }

  /**
   * Starts cleanup requests for all failed allocation units in a given pool specified by @poolId.
   * @param poolId id of pool for which the cleanup requests are created
   * @param force when set to true force delete is used
   */
  cleanupFailed(poolId: number, force: boolean): Observable<any> {
    return this.displayConfirmationDialog(poolId, 'Create').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCleanupFailed(poolId, force) : EMPTY
      )
    );
  }

  /**
   * Starts cleanup requests for all unlocked allocation units in a given pool specified by @poolId.
   * @param poolId id of pool for which the cleanup requests are created
   * @param force when set to true force delete is used
   */
  cleanupUnlocked(poolId: number, force: boolean): Observable<any> {
    return this.displayConfirmationDialog(poolId, 'Create').pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCleanupUnlocked(poolId, force) : EMPTY
      )
    );
  }

  /**
   * Initializes default resources with given pageSize
   * @param pageSize size of a page for pagination
   */
  protected initSubject(pageSize: number): PaginatedResource<SandboxAllocationUnit> {
    return new PaginatedResource([], new OffsetPagination(0, 0, pageSize, 0, 0));
  }

  private displayConfirmationDialog(poolId: number, title: string): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        `${title} Cleanup Request`,
        `Do you want to delete all sandboxes for pool ${poolId}?`,
        'Cancel',
        'Delete'
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(request: Request): Observable<any> {
    return this.sauApi.deleteCleanupRequest(request.allocationUnitId).pipe(
      tap(
        () => this.notificationService.emit('success', `Delete Allocation Units`),
        (err) => this.errorHandler.emit(err, 'Deleting Allocation Units')
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching allocation units');
    this.hasErrorSubject$.next(true);
  }

  private callApiToCleanupMultiple(poolId: number, force: boolean): any {
    return this.handleApiRequests(this.poolApi.createMultipleCleanupRequests(poolId, force), poolId);
  }

  private callApiToCleanupFailed(poolId: number, force: boolean): any {
    return this.handleApiRequests(this.poolApi.createFailedCleanupRequests(poolId, force), poolId);
  }

  private callApiToCleanupUnlocked(poolId: number, force: boolean): any {
    return this.handleApiRequests(this.poolApi.createUnlockedCleanupRequests(poolId, force), poolId);
  }

  private handleApiRequests(request: Observable<any>, poolId: number): any {
    return request.pipe(
      tap({
        next: () => this.notificationService.emit('success', `Cleanup request for pool ${poolId}`),
        error: (err) => this.errorHandler.emit(err, `Creating cleanup request for pool ${poolId}`),
      }),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }
}
