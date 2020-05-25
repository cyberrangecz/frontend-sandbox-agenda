import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { PoolRequestApi } from 'kypo-sandbox-api';
import { Request } from 'kypo-sandbox-model';
import { BehaviorSubject, EMPTY, merge, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxNotificationService } from '../../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { PoolAllocationRequestsPollingService } from './pool-allocation-requests-polling.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get creation requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class PoolAllocationRequestsConcreteService extends PoolAllocationRequestsPollingService {
  private manuallyUpdatedRequests$: BehaviorSubject<KypoPaginatedResource<Request>>;
  constructor(
    private api: PoolRequestApi,
    private dialog: MatDialog,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
    this.manuallyUpdatedRequests$ = new BehaviorSubject(this.initSubject(context.config.defaultPaginationSize));
    this.resource$ = merge(this.poll$, this.manuallyUpdatedRequests$.asObservable());
  }

  /**
   * Gets all allocation requests with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with allocation requests
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: KypoRequestedPagination): Observable<KypoPaginatedResource<Request>> {
    this.onManualGetAll(poolId, pagination);
    return this.api.getAllocationRequests(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => this.manuallyUpdatedRequests$.next(paginatedRequests),
        (err) => this.onGetAllError(err)
      )
    );
  }

  /**
   * Cancels an allocation request, informs about the result and updates list of requests or handles an error
   * @param request a request to be cancelled
   */
  cancel(request: Request): Observable<any> {
    return this.displayConfirmationDialog(request, 'Confirm').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToCancel(request) : EMPTY))
    );
  }

  /**
   * Creates a cleanup request, informs about the result and updates list of requests or handles an error
   * @param request a request to be deleted
   */
  delete(request: Request): Observable<any> {
    return this.displayConfirmationDialog(request, 'Delete').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToDelete(request) : EMPTY))
    );
  }

  private displayConfirmationDialog(request: Request, action: string): Observable<CsirtMuDialogResultEnum> {
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {
      data: new CsirtMuConfirmationDialogConfig(
        `${action} allocation request`,
        `Do you want to ${action} allocation request "${request.id}"?`,
        'Cancel',
        action
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(request: Request): Observable<any> {
    return this.api.createCleanupRequest(request.allocationUnitId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Created cleanup request`),
        (err) => this.errorHandler.emit(err, 'Creating cleanup request')
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToCancel(request: Request): Observable<any> {
    return this.api.cancelAllocationRequest(request.allocationUnitId, request.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Allocation request ${request.id} cancelled`),
        (err) => this.errorHandler.emit(err, 'Cancelling allocation request ' + request.id)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  /**
   * Repeats last get all request for polling purposes
   */
  protected repeatLastGetAllRequest(): Observable<KypoPaginatedResource<Request>> {
    this.hasErrorSubject$.next(false);
    return this.api
      .getAllocationRequests(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching allocation requests');
    this.hasErrorSubject$.next(true);
  }
}
