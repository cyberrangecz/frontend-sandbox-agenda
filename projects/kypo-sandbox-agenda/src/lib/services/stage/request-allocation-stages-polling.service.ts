import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { StagesApi } from 'kypo-sandbox-api';
import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { RequestStagesPollingService } from './request-stages-polling.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get stages of creation or cleanup requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class RequestAllocationStagesPollingService extends RequestStagesPollingService {
  constructor(
    private api: StagesApi,
    private context: SandboxAgendaContext,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }

  /**
   * Gets all stages and updates related observables or handles an error
   * @param request request associated with stages
   */
  getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>> {
    this.onManualGetAll(request);
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    return this.api.getAllocationStages(request.allocationUnitId, request.id, fakePagination).pipe(
      tap(
        (stages) => this.resourceSubject$.next(stages),
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected repeatLastGetAllRequest(): Observable<KypoPaginatedResource<RequestStage>> {
    this.hasErrorSubject$.next(false);
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    return this.api
      .getAllocationStages(this.request.allocationUnitId, this.request.id, fakePagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private onManualGetAll(request: Request) {
    this.request = request;
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching stages');
    this.hasErrorSubject$.next(true);
  }
}
