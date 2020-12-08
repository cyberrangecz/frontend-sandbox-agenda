import { Injectable } from '@angular/core';
import { SandboxAllocationUnitsService } from './sandbox-allocation-units.service';
import { BehaviorSubject, EMPTY, merge, Observable, timer } from 'rxjs';
import { PaginatedResource, RequestedPagination, SentinelPagination } from '@sentinel/common';
import { AllocationRequestsApi, PoolApi, SandboxAllocationUnitsApi } from '@muni-kypo-crp/sandbox-api';
import { Request, SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';
import { SandboxErrorHandler, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { retryWhen, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class SandboxAllocationUnitsConcreteService extends SandboxAllocationUnitsService {
  private lastPoolId: number;
  private poolPeriod: number;

  constructor(
    private poolApi: PoolApi,
    private sauApi: SandboxAllocationUnitsApi,
    private allocationRequestsApi: AllocationRequestsApi,
    private dialog: MatDialog,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
    this.unitsSubject$ = new BehaviorSubject(this.initSubject(10));
    this.poolPeriod = context.config.pollingPeriod;
    this.units$ = merge(this.createPoll(), this.unitsSubject$.asObservable());
  }

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: RequestedPagination): Observable<PaginatedResource<SandboxAllocationUnit>> {
    this.onManualResourceRefresh(pagination, poolId);
    return this.poolApi.getPoolsSandboxAllocationUnits(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => {
          this.unitsSubject$.next(paginatedRequests);
        },
        (err) => this.onGetAllError(err)
      )
    );
  }

  /**
   * Creates cleanup request for sandbox allocation units for pool, informs about the result and updates list of sandbox allocation units
   * or handles an error
   * @param request a cleanup request to be created
   */
  cleanup(request: Request): Observable<any> {
    return this.displayConfirmationDialog(
      request,
      'Create',
      'create a cleanup request to allocation request',
      'No',
      'Yes'
    ).pipe(
      switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCleanup(request) : EMPTY))
    );
  }

  /**
   * Performs necessary operations and updates state of the service.
   * @param pagination new requested pagination
   * @param params any other parameters required to update data in your concrete service
   */
  protected onManualResourceRefresh(pagination: RequestedPagination, ...params: any[]): void {
    this.lastPagination = pagination;
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
    this.lastPoolId = params[0];
  }

  /**
   * Initializes default resources with given pageSize
   * @param pageSize size of a page for pagination
   */
  protected initSubject(pageSize: number): PaginatedResource<SandboxAllocationUnit> {
    return new PaginatedResource([], new SentinelPagination(0, 0, pageSize, 0, 0));
  }

  /**
   * Repeats last get all request for polling purposes
   */
  protected refreshResources(): Observable<PaginatedResource<SandboxAllocationUnit>> {
    this.hasErrorSubject$.next(false);
    return this.poolApi
      .getPoolsSandboxAllocationUnits(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  /**
   * Creates poll observable using a timer. You can extend the behaviour by piping the observable and applying
   * RxJs operators on it (e.g. takeWhile to stop polling on specific conditions)
   */
  protected createPoll(): Observable<PaginatedResource<SandboxAllocationUnit>> {
    // The initial delay is set to synchronize it with pools from other tables
    return timer(this.poolPeriod, this.poolPeriod).pipe(
      switchMap(() => this.refreshResources()),
      retryWhen(() => this.retryPolling$)
    );
  }

  private displayConfirmationDialog(
    request: Request,
    title: string,
    action: string,
    cancelLabel: string,
    confirmLabel: string
  ): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        `${title} Cleanup Request`,
        `Do you want to ${action.toLowerCase()} "${request.id}"?`,
        cancelLabel,
        confirmLabel
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

  private callApiToCleanup(request: Request): Observable<any> {
    return this.sauApi.createCleanupRequest(request.id).pipe(
      tap(
        () => this.notificationService.emit('success', `Cleanup request for allocation units ${request.id}`),
        (err) => this.errorHandler.emit(err, 'Creating cleanup request for allocation units ' + request.id)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching allocation units');
    this.hasErrorSubject$.next(true);
  }
}
