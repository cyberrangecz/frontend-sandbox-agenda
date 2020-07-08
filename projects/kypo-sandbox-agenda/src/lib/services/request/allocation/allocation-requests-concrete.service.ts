import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { AllocationRequestsApi, PoolApi, SandboxAllocationUnitsApi } from 'kypo-sandbox-api';
import { Request } from 'kypo-sandbox-model';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxNotificationService } from '../../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { AllocationRequestsService } from './allocation-requests.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get creation requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class AllocationRequestsConcreteService extends AllocationRequestsService {
  constructor(
    private poolApi: PoolApi,
    private allocationRequestsApi: AllocationRequestsApi,
    private sauApi: SandboxAllocationUnitsApi,
    private dialog: MatDialog,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }
  private lastPoolId: number;

  protected abstract;

  /**
   * Gets all allocation requests with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with allocation requests
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: RequestedPagination): Observable<PaginatedResource<Request>> {
    this.onManualResourceRefresh(pagination, poolId);
    return this.poolApi.getAllocationRequests(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => this.resourceSubject$.next(paginatedRequests),
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected onManualResourceRefresh(pagination: RequestedPagination, ...params) {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastPoolId = params[0];
  }

  /**
   * Cancels an allocation request, informs about the result and updates list of requests or handles an error
   * @param request a request to be cancelled
   */
  cancel(request: Request): Observable<any> {
    return this.displayConfirmationDialog(request, 'Cancel', 'No', 'Yes').pipe(
      switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCancel(request) : EMPTY))
    );
  }

  /**
   * Creates a cleanup request, informs about the result and updates list of requests or handles an error
   * @param request a request to be deleted
   */
  delete(request: Request): Observable<any> {
    return this.displayConfirmationDialog(request, 'Delete', 'Cancel', 'Delete').pipe(
      switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(request) : EMPTY))
    );
  }

  /**
   * Repeats last get all request for polling purposes
   */
  protected refreshResource(): Observable<PaginatedResource<Request>> {
    this.hasErrorSubject$.next(false);
    return this.poolApi
      .getAllocationRequests(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private displayConfirmationDialog(
    request: Request,
    action: string,
    cancelLabel: string,
    confirmLabel: string
  ): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        `${action} allocation request`,
        `Do you want to ${action.toLowerCase()} allocation request "${request.id}"?`,
        cancelLabel,
        confirmLabel
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(request: Request): Observable<any> {
    return this.sauApi.createCleanupRequest(request.allocationUnitId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Created cleanup request`),
        (err) => this.errorHandler.emit(err, 'Creating cleanup request')
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToCancel(request: Request): Observable<any> {
    return this.allocationRequestsApi.cancel(request.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Allocation request ${request.id} cancelled`),
        (err) => this.errorHandler.emit(err, 'Cancelling allocation request ' + request.id)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching allocation requests');
    this.hasErrorSubject$.next(true);
  }
}
