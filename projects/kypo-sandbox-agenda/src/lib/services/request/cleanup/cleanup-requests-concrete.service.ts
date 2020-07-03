import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { CleanupRequestsApi, PoolApi, SandboxAllocationUnitsApi } from 'kypo-sandbox-api';
import { CleanupRequest, Request } from 'kypo-sandbox-model';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { RequestsService } from '../requests.service';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { SandboxNotificationService } from '../../client/sandbox-notification.service';
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
  resource$: Observable<KypoPaginatedResource<Request>>;

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
  getAll(poolId: number, pagination: KypoRequestedPagination): Observable<KypoPaginatedResource<Request>> {
    this.onManualResourceRefresh(pagination, poolId);
    return this.poolApi.getCleanupRequests(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => this.resourceSubject$.next(paginatedRequests),
        (err) => this.onGetAllError(err)
      )
    );
  }

  cancel(request: CleanupRequest): Observable<any> {
    return this.displayConfirmationDialog(request, 'Cancel', 'No', 'Yes').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToCancel(request) : EMPTY))
    );
  }

  delete(request: CleanupRequest): Observable<any> {
    return this.displayConfirmationDialog(request, 'Delete', 'Cancel', 'Delete').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToDelete(request) : EMPTY))
    );
  }

  protected onManualResourceRefresh(pagination: KypoRequestedPagination, ...params) {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastPoolId = params[0];
  }

  /**
   * Repeats last get all request for polling purposes
   */
  protected refreshResource(): Observable<KypoPaginatedResource<Request>> {
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
    action: string,
    cancelLabel: string,
    confirmLabel: string
  ): Observable<CsirtMuDialogResultEnum> {
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {
      data: new CsirtMuConfirmationDialogConfig(
        `${action} cleanup request`,
        `Do you want to ${action.toLowerCase()} cleanup request "${request.id}"?`,
        cancelLabel,
        confirmLabel
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(request: Request): Observable<any> {
    return this.sauApi.deleteCleanupRequest(request.allocationUnitId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Deleted cleanup request`),
        (err) => this.errorHandler.emit(err, 'Deleting cleanup request')
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }

  private callApiToCancel(request: Request): Observable<any> {
    return this.cleanupRequestsApi.cancel(request.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Cleanup request ${request.id} cancelled`),
        (err) => this.errorHandler.emit(err, 'Cancelling cleanup request ' + request.id)
      ),
      switchMap((_) => this.getAll(this.lastPoolId, this.lastPagination))
    );
  }
}
