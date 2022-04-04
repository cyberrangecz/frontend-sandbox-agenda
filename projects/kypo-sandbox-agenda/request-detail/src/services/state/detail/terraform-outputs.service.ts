import { Injectable } from '@angular/core';
import { StageDetailService } from './stage-detail.service';
import { AllocationRequestsApi } from '@muni-kypo-crp/sandbox-api';
import { RequestStage } from '@muni-kypo-crp/sandbox-model';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class TerraformOutputsService extends StageDetailService {
  constructor(
    private api: AllocationRequestsApi,
    private context: SandboxAgendaContext,
    protected pollRegistry: StagesDetailPollRegistry
  ) {
    super(pollRegistry, Number.MAX_SAFE_INTEGER, context.config.pollingPeriod);
  }

  protected callApiToGetStageDetail(
    stage: RequestStage,
    requestedPagination: OffsetPaginationEvent
  ): Observable<PaginatedResource<string>> {
    return this.api.getTerraformOutputs(stage.requestId, requestedPagination).pipe(
      map((paginatedResources) => {
        const formattedEvents = paginatedResources.elements.map((event) => `${event.content}`);
        return new PaginatedResource<string>(formattedEvents, paginatedResources.pagination);
      })
    );
  }
}
