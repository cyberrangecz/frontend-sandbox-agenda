import { Injectable } from '@angular/core';
import { StageDetailService } from './stage-detail.service';
import { AllocationRequestsApi } from 'kypo-sandbox-api';
import { RequestStage } from 'kypo-sandbox-model';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class OpenStackEventsService extends StageDetailService {
  constructor(
    private api: AllocationRequestsApi,
    private context: SandboxAgendaContext,
    protected pollRegistry: StagesDetailPollRegistry
  ) {
    super(pollRegistry, 500, context.config.pollingPeriod);
  }

  protected callApiToGetStageDetail(
    stage: RequestStage,
    requestedPagination: RequestedPagination
  ): Observable<PaginatedResource<string>> {
    return this.api.getOpenStackEvents(stage.requestId, requestedPagination).pipe(
      map((paginatedResources) => {
        const formattedEvents = paginatedResources.elements.map(
          (event) => `${event.time} ${event.name} ${event.status} ${event.statusReason}`
        );
        return new PaginatedResource<string>(formattedEvents, paginatedResources.pagination);
      })
    );
  }
}
