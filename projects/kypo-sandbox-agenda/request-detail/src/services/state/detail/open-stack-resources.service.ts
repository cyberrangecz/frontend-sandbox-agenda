import { StageDetailService } from './stage-detail.service';
import { AllocationRequestsApi } from '@muni-kypo-crp/sandbox-api';
import { RequestStage } from '@muni-kypo-crp/sandbox-model';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { Observable } from 'rxjs';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class OpenStackResourcesService extends StageDetailService {
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
    return this.api.getOpenStackResources(stage.requestId, requestedPagination).pipe(
      map((paginatedResources) => {
        const formattedResources = paginatedResources.elements.map(
          (resource) => `${resource.name} ${resource.type} ${resource.status}`
        );
        return new PaginatedResource<string>(formattedResources, paginatedResources.pagination);
      })
    );
  }
}
