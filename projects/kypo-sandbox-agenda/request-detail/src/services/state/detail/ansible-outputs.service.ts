import { StageDetailService } from './stage-detail.service';
import { RequestStage, RequestStageType } from 'kypo-sandbox-model';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { Observable } from 'rxjs';
import { AllocationRequestsApi } from 'kypo-sandbox-api';
import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { Injectable } from '@angular/core';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class AnsibleOutputsService extends StageDetailService {
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
    if (stage.type === RequestStageType.NETWORKING_ANSIBLE_ALLOCATION) {
      return this.api.getNetworkingAnsibleOutputs(stage.requestId, requestedPagination);
    } else if (stage.type === RequestStageType.USER_ANSIBLE_ALLOCATION) {
      return this.api.getUserAnsibleOutputs(stage.requestId, requestedPagination);
    }
  }
}
