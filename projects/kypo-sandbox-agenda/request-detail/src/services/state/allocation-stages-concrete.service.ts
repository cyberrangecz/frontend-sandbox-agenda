import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '@muni-kypo-crp/sandbox-model';
import { Observable, zip } from 'rxjs';
import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { RequestStagesService } from './request-stages.service';
import { AllocationRequestsApi } from '@muni-kypo-crp/sandbox-api';
import { map } from 'rxjs/operators';
import { StageAdapterMapper } from '../../model/adapters/stage-adapter-mapper';
import { StageAdapter } from '../../model/adapters/stage-adapter';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get stages of creation or cleanup requests, poll them and perform various operations to modify them.
 */
@Injectable()
export class AllocationStagesConcreteService extends RequestStagesService {
  constructor(
    private api: AllocationRequestsApi,
    private context: SandboxAgendaContext,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.pollingPeriod);
  }

  protected callApiToGetStages(request: Request): Observable<StageAdapter[]> {
    return zip(
      this.api.getOpenStackStage(request.id),
      this.api.getNetworkingAnsibleStage(request.id),
      this.api.getUserAnsibleStage(request.id)
    ).pipe(map((stages) => stages.map((stage) => StageAdapterMapper.fromStage(stage))));
  }

  protected onGetAllError(err: HttpErrorResponse): void {
    this.errorHandler.emit(err, 'Fetching stages');
    this.hasErrorSubject$.next(true);
  }
}
