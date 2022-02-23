import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common';
import { CleanupRequestsApi, PoolApi, SandboxAllocationUnitsApi } from '@muni-kypo-crp/sandbox-api';
import { CleanupRequest, Request } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { RequestsService } from '../requests.service';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { MatDialog } from '@angular/material/dialog';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get cleanup requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class CleanupRequestsConcreteService extends RequestsService {
  private lastPoolId: number;

  /**
   * List of cleanup requests with currently selected pagination options
   */
  resource$: Observable<PaginatedResource<Request>>;

  constructor(
    private poolApi: PoolApi,
    private sauApi: SandboxAllocationUnitsApi,
    private cleanupRequestsApi: CleanupRequestsApi,
    private context: SandboxAgendaContext,
    private dialog: MatDialog,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }

  /**
   * Gets all cleanup requests with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with cleanup requests
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: OffsetPaginationEvent): Observable<PaginatedResource<Request>> {
    this.onManualResourceRefresh(pagination, poolId);
    return this.poolApi.getCleanupRequests(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => this.resourceSubject$.next(paginatedRequests),
        (err) => this.onGetAllError(err)
      )
    );
  }

  cancel(request: CleanupRequest): Observable<any> {
    return this.displayConfirmationDialog(request, 'Cancel', 'Cancel cleanup request', 'No', 'Yes').pipe(
      switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToCancel(request) : EMPTY))
    );
  }

  /**
   * Deletes a cleanup request, informs about the result and updates list of requests or handles an error
   * @param request a cleanup request to be deleted
   */
  delete(request: CleanupRequest): Observable<any> {
    return this.displayConfirmationDialog(request, 'Delete', 'delete cleanup', 'Cancel', 'Delete').pipe(
      switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(request) : EMPTY))
    );
  }

  protected onManualResourceRefresh(pagination: OffsetPaginationEvent, ...params: any[]): void {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastPoolId = params[0];
  }

  /**
   * Repeats last get all request for polling purposes
   */
  protected refreshResource(): Observable<PaginatedResource<Request>> {
    this.hasErrorSubject$.next(false);
    return this.poolApi
      .getCleanupRequests(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching cleanup requests');
    this.hasErrorSubject$.next(true);
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
        `${title} cleanup request`,
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
        () => this.notificationService.emit('success', `Delete cleanup request`),
        (err) => this.errorHandler.emit(err, 'Deleting cleanup request')
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToCancel(request: Request): Observable<any> {
    return this.cleanupRequestsApi.cancel(request.id).pipe(
      tap(
        () => this.notificationService.emit('success', `Cleanup request ${request.id} cancelled`),
        (err) => this.errorHandler.emit(err, 'Cancelling cleanup request ' + request.id)
      ),
      switchMap(() => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }
}
