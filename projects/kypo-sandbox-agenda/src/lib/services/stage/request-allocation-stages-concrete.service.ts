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
import { RequestStagesService } from './request-stages.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get stages of creation or cleanup requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class RequestAllocationStagesConcreteService extends RequestStagesService {
  private lastRequest: Request;

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
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    this.onManualResourceRefresh(fakePagination, request);
    return this.api.getAllocationStages(request.allocationUnitId, request.id, fakePagination).pipe(
      tap(
        (stages) => this.resourceSubject$.next(stages),
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected onManualResourceRefresh(pagination: KypoRequestedPagination, ...params) {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastRequest = params[0];
  }

  protected refreshResource(): Observable<KypoPaginatedResource<RequestStage>> {
    this.hasErrorSubject$.next(false);
    return this.api
      .getAllocationStages(this.lastRequest.allocationUnitId, this.lastRequest.id, this.lastPagination)
      .pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  private onGetAllError(err: HttpErrorResponse) {
    this.errorHandler.emit(err, 'Fetching stages');
    this.hasErrorSubject$.next(true);
  }
}
