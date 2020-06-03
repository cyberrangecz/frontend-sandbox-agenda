import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { PoolRequestApi } from 'kypo-sandbox-api';
import { Request } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { PoolRequestsService } from '../pool-requests.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get cleanup requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class PoolCleanupRequestsConcreteService extends PoolRequestsService {
  private lastPoolId: number;

  /**
   * List of cleanup requests with currently selected pagination options
   */
  resource$: Observable<KypoPaginatedResource<Request>>;

  constructor(
    private api: PoolRequestApi,
    private context: SandboxAgendaContext,
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
    return this.api.getCleanupRequests(poolId, pagination).pipe(
      tap(
        (paginatedRequests) => this.resourceSubject$.next(paginatedRequests),
        (err) => this.onGetAllError(err)
      )
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
    return this.api
      .getCleanupRequests(this.lastPoolId, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching cleanup requests');
    this.hasErrorSubject$.next(true);
  }
}
