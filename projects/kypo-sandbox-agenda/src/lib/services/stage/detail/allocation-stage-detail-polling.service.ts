import { Injectable } from '@angular/core';
import { RequestedPagination } from '@sentinel/common';
import { NetworkingAnsibleAllocationStage, OpenStackAllocationStage, RequestStageType } from 'kypo-sandbox-model';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AnsibleAllocationStageDetailState } from '../../../model/stage/ansible-allocation-stage-detail-state';
import { OpenStackAllocationStageDetailState } from '../../../model/stage/open-stack-allocation-stage-detail-state';
import { OpenStackEventsDetail } from '../../../model/stage/open-stack-events-detail';
import { OpenstackResourcesDetail } from '../../../model/stage/openstack-resources-detail';
import { StageDetailAdditionalInfo } from '../../../model/stage/stage-detail-additional-info';
import { StageDetailBasicInfo } from '../../../model/stage/stage-detail-basic-info';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { StageDetailPollingService } from './stage-detail-polling.service';
import { AllocationRequestsApi } from 'kypo-sandbox-api';
import { AnsibleAllocationStage } from '../../../model/types/stages';

/**
 * Service extending stage detail service of polling behaviour.
 * Stages must bust be first subscribed to be added to a list of polled stages.
 */
@Injectable()
export class AllocationStageDetailPollingService extends StageDetailPollingService {
  constructor(private api: AllocationRequestsApi, private context: SandboxAgendaContext) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(
    requestId: number,
    stageType: RequestStageType,
    additionalInfoPagination?: RequestedPagination[]
  ): Observable<StageDetailState> {
    switch (stageType) {
      case RequestStageType.OPEN_STACK_ALLOCATION: {
        return this.createOpenStackStageState(requestId, additionalInfoPagination);
      }
      case RequestStageType.NETWORKING_ANSIBLE_ALLOCATION: {
        return this.createNetworkingAnsibleStageState(requestId, additionalInfoPagination);
      }
      case RequestStageType.USER_ANSIBLE_ALLOCATION: {
        return this.createUserAnsibleStageState(requestId, additionalInfoPagination);
      }
      default: {
        return throwError(
          new Error(`Request stage of type "${stageType}" is not supported by AllocationStageDetailPollingService`)
        );
      }
    }
  }

  private createOpenStackStageState(
    requestId: number,
    additionalInfoPagination: RequestedPagination[]
  ): Observable<StageDetailState> {
    if (!additionalInfoPagination || additionalInfoPagination.length < 2) {
      additionalInfoPagination = [new RequestedPagination(0, 500, '', ''), new RequestedPagination(0, 500, '', '')];
    }
    return zip(
      this.createOpenStackAllocationBasicInfo(requestId),
      this.createOpenStackResources(requestId, additionalInfoPagination[0]),
      this.createOpenStackEvents(requestId, additionalInfoPagination[1])
    ).pipe(
      map((results) => {
        const basicInfo = results[0];
        const additionalInfo = [results[1], results[2]];
        return new OpenStackAllocationStageDetailState(basicInfo, additionalInfo);
      })
    );
  }

  private createNetworkingAnsibleStageState(
    stageId: number,
    additionalInfoPagination: RequestedPagination[]
  ): Observable<StageDetailState> {
    if (!additionalInfoPagination || additionalInfoPagination.length < 1) {
      additionalInfoPagination = [new RequestedPagination(0, 500, '', '')];
    }
    return zip(
      this.createNetworkingAnsibleAllocationBasicInfo(stageId),
      this.createNetworkingAnsibleAllocationOutput(stageId, additionalInfoPagination[0])
    ).pipe(
      map((results) => {
        const basicInfo = results[0];
        const additionalInfo = [results[1]];
        return new AnsibleAllocationStageDetailState(basicInfo, additionalInfo);
      })
    );
  }

  private createNetworkingAnsibleAllocationBasicInfo(
    stageId
  ): Observable<StageDetailBasicInfo<NetworkingAnsibleAllocationStage>> {
    return this.api.getNetworkingAnsibleStage(stageId).pipe(
      map((stage) => new StageDetailBasicInfo(stage)),
      catchError((err) => this.handleAnsibleBasicStageError(stageId))
    );
  }

  private createNetworkingAnsibleAllocationOutput(
    stageId: number,
    pagination: RequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getNetworkingAnsibleOutputs(stageId, pagination).pipe(
      map((output) => new StageDetailAdditionalInfo('Networking Ansible Output', output, pagination)),
      catchError((err) => of(new StageDetailAdditionalInfo('Networking Ansible Output', undefined, pagination, true)))
    );
  }

  private createUserAnsibleStageState(
    requestId: number,
    additionalInfoPagination: RequestedPagination[]
  ): Observable<StageDetailState> {
    if (!additionalInfoPagination || additionalInfoPagination.length < 1) {
      additionalInfoPagination = [new RequestedPagination(0, 500, '', '')];
    }
    return zip(
      this.createUserAnsibleAllocationBasicInfo(requestId),
      this.createUserAnsibleAllocationOutput(requestId, additionalInfoPagination[0])
    ).pipe(
      map((results) => {
        const basicInfo = results[0];
        const additionalInfo = [results[1]];
        return new AnsibleAllocationStageDetailState(basicInfo, additionalInfo);
      })
    );
  }

  private createUserAnsibleAllocationBasicInfo(
    requestId
  ): Observable<StageDetailBasicInfo<NetworkingAnsibleAllocationStage>> {
    return this.api.getUserAnsibleStage(requestId).pipe(
      map((stage) => new StageDetailBasicInfo(stage)),
      catchError((err) => this.handleAnsibleBasicStageError(requestId))
    );
  }

  private createUserAnsibleAllocationOutput(
    requestId: number,
    pagination: RequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getUserAnsibleOutputs(requestId, pagination).pipe(
      map((output) => new StageDetailAdditionalInfo('User Ansible Output', output, pagination)),
      catchError((err) => of(new StageDetailAdditionalInfo('User Ansible Output', undefined, pagination, true)))
    );
  }

  private createOpenStackAllocationBasicInfo(
    requestId: number
  ): Observable<StageDetailBasicInfo<OpenStackAllocationStage>> {
    return this.api.getOpenStackStage(requestId).pipe(
      map((stage) => new StageDetailBasicInfo(stage)),
      catchError((err) => this.handleOpenstackBasicStageError(requestId))
    );
  }

  private createOpenStackResources(
    requestId: number,
    pagination: RequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getOpenStackResources(requestId, pagination).pipe(
      map((resources) => new OpenstackResourcesDetail(resources, pagination)),
      catchError((err) => of(new OpenstackResourcesDetail(undefined, pagination, true)))
    );
  }

  private createOpenStackEvents(
    requestId: number,
    pagination: RequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getOpenStackEvents(requestId, pagination).pipe(
      map((events) => new OpenStackEventsDetail(events, pagination)),
      catchError((err) => of(new OpenStackEventsDetail(undefined, pagination, true)))
    );
  }

  private handleOpenstackBasicStageError(stageId: number): Observable<StageDetailBasicInfo<OpenStackAllocationStage>> {
    const errStage = new OpenStackAllocationStage();
    errStage.id = stageId;
    return of(new StageDetailBasicInfo(errStage, true));
  }

  private handleAnsibleBasicStageError(stageId: number): Observable<StageDetailBasicInfo<AnsibleAllocationStage>> {
    const errStage = new NetworkingAnsibleAllocationStage();
    errStage.id = stageId;
    return of(new StageDetailBasicInfo(errStage, true));
  }
}
