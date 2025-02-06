import { StageDetailService } from './stage-detail.service';
import { RequestStage, RequestStageType } from '@cyberrangecz-platform/sandbox-model';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { Observable } from 'rxjs';
import { AllocationRequestsApi } from '@cyberrangecz-platform/sandbox-api';
import { SandboxAgendaContext } from '@cyberrangecz-platform/sandbox-agenda/internal';
import { Injectable } from '@angular/core';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

@Injectable()
export class AnsibleOutputsService extends StageDetailService {
  constructor(
    private api: AllocationRequestsApi,
    private context: SandboxAgendaContext,
    protected pollRegistry: StagesDetailPollRegistry,
  ) {
    super(pollRegistry, 500, context.config.pollingPeriod);
  }

  protected callApiToGetStageDetail(
    stage: RequestStage,
    requestedPagination: OffsetPaginationEvent,
  ): Observable<PaginatedResource<string>> {
    if (stage.type === RequestStageType.NETWORKING_ANSIBLE_ALLOCATION) {
      return this.api.getNetworkingAnsibleOutputs(stage.requestId, requestedPagination);
    } else if (stage.type === RequestStageType.USER_ANSIBLE_ALLOCATION) {
      return this.api.getUserAnsibleOutputs(stage.requestId, requestedPagination);
    }
  }
}
