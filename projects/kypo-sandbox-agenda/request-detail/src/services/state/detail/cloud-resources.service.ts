import { StageDetailService } from './stage-detail.service';
import { AllocationRequestsApi } from '@muni-kypo-crp/sandbox-api';
import { RequestStage } from '@muni-kypo-crp/sandbox-model';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common/pagination';
import { Observable } from 'rxjs';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class CloudResourcesService extends StageDetailService {
  constructor(
    private api: AllocationRequestsApi,
    private context: SandboxAgendaContext,
    protected pollRegistry: StagesDetailPollRegistry
  ) {
    super(pollRegistry, 500, context.config.pollingPeriod);
  }

  protected callApiToGetStageDetail(
    stage: RequestStage,
    requestedPagination: OffsetPaginationEvent
  ): Observable<PaginatedResource<string>> {
    return this.api.getCloudResources(stage.requestId, requestedPagination).pipe(
      map((paginatedResources) => {
        const formattedResources = paginatedResources.elements.map(
          (resource) => `${resource.name} ${resource.type} ${resource.status}`
        );
        return new PaginatedResource<string>(formattedResources, paginatedResources.pagination);
      })
    );
  }
}
