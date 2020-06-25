import { Injectable } from '@angular/core';
import { KypoRequestedPagination } from 'kypo-common';
import { StagesApi } from 'kypo-sandbox-api';
import { AnsibleAllocationStage, OpenStackAllocationStage, RequestStageType } from 'kypo-sandbox-model';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AllocationAnsibleStageDetailState } from '../../../model/stage/allocation-ansible-stage-detail-state';
import { OpenstackAllocationStageDetailState } from '../../../model/stage/openstack-allocation-stage-detail-state';
import { OpenstackEventsDetail } from '../../../model/stage/openstack-events-detail';
import { OpenstackResourcesDetail } from '../../../model/stage/openstack-resources-detail';
import { StageDetailAdditionalInfo } from '../../../model/stage/stage-detail-additional-info';
import { StageDetailBasicInfo } from '../../../model/stage/stage-detail-basic-info';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { StageDetailPollingService } from './stage-detail-polling.service';

/**
 * Service extending stage detail service of polling behaviour.
 * Stages must bust be first subscribed to be added to a list of polled stages.
 */
@Injectable()
export class AllocationStageDetailPollingService extends StageDetailPollingService {
  constructor(private api: StagesApi, private context: SandboxAgendaContext) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(
    stageId: number,
    stageType: RequestStageType,
    additionalInfoPagination?: KypoRequestedPagination[]
  ): Observable<StageDetailState> {
    if (stageType === RequestStageType.OPENSTACK_ALLOCATION) {
      return this.createOpenstackStageState(stageId, additionalInfoPagination);
    } else if (stageType === RequestStageType.ANSIBLE_ALLOCATION) {
      return this.createAnsibleStageState(stageId, additionalInfoPagination);
    } else {
      return throwError(
        new Error(`Request stage of type "${stageType}" is not supported by AllocationStageDetailPollingService`)
      );
    }
  }

  private createOpenstackStageState(
    stageId: number,
    additionalInfoPagination: KypoRequestedPagination[]
  ): Observable<StageDetailState> {
    if (!additionalInfoPagination || additionalInfoPagination.length < 2) {
      additionalInfoPagination = [
        new KypoRequestedPagination(0, 500, '', ''),
        new KypoRequestedPagination(0, 500, '', ''),
      ];
    }
    return zip(
      this.createOpenstackAllocationBasicInfo(stageId)
      // TODO: Uncomment once https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-sandbox-service/-/issues/91 is closed
      // this.createOpenstackResources(stageId, additionalInfoPagination[0]),
      // TODO: Uncomment once https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-sandbox-service/-/issues/91 is closed
      // this.createOpenstackEvents(stageId, additionalInfoPagination[1])
    ).pipe(
      map((results) => {
        const basicInfo = results[0];
        // TODO: Uncomment once https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-sandbox-service/-/issues/91 is closed
        //  const additionalInfo = [results[1], results[2]];
        const additionalInfo = [];
        return new OpenstackAllocationStageDetailState(basicInfo, additionalInfo);
      })
    );
  }

  private createAnsibleStageState(
    stageId: number,
    additionalInfoPagination: KypoRequestedPagination[]
  ): Observable<StageDetailState> {
    if (!additionalInfoPagination || additionalInfoPagination.length < 1) {
      additionalInfoPagination = [new KypoRequestedPagination(0, 500, '', '')];
    }
    return zip(
      this.createAnsibleAllocationBasicInfo(stageId),
      this.createAnsibleAllocationOutput(stageId, additionalInfoPagination[0])
    ).pipe(
      map((results) => {
        const basicInfo = results[0];
        const additionalInfo = [results[1]];
        return new AllocationAnsibleStageDetailState(basicInfo, additionalInfo);
      })
    );
  }

  private createAnsibleAllocationBasicInfo(stageId): Observable<StageDetailBasicInfo<AnsibleAllocationStage>> {
    return this.api.getAnsibleAllocationStage(stageId).pipe(
      map((stage) => new StageDetailBasicInfo(stage)),
      catchError((err) => this.handleAnsibleBasicStageError(stageId))
    );
  }

  private createAnsibleAllocationOutput(
    stageId: number,
    pagination: KypoRequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getAnsibleAllocationStageOutput(stageId, pagination).pipe(
      map((output) => new StageDetailAdditionalInfo('Ansible Output', output, pagination)),
      catchError((err) => of(new StageDetailAdditionalInfo('Ansible Output', undefined, pagination, true)))
    );
  }

  private createOpenstackAllocationBasicInfo(
    stageId: number
  ): Observable<StageDetailBasicInfo<OpenStackAllocationStage>> {
    return this.api.getOpenstackAllocationStage(stageId).pipe(
      map((stage) => new StageDetailBasicInfo(stage)),
      catchError((err) => this.handleOpenstackBasicStageError(stageId))
    );
  }

  private createOpenstackResources(
    stageId: number,
    pagination: KypoRequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getOpenstackAllocationResources(stageId, pagination).pipe(
      map((resources) => new OpenstackResourcesDetail(resources, pagination)),
      catchError((err) => of(new OpenstackResourcesDetail(undefined, pagination, true)))
    );
  }

  private createOpenstackEvents(
    stageId: number,
    pagination: KypoRequestedPagination
  ): Observable<StageDetailAdditionalInfo> {
    return this.api.getOpenstackAllocationEvents(stageId, pagination).pipe(
      map((events) => new OpenstackEventsDetail(events, pagination)),
      catchError((err) => of(new OpenstackEventsDetail(undefined, pagination, true)))
    );
  }

  private handleOpenstackBasicStageError(stageId: number): Observable<StageDetailBasicInfo<OpenStackAllocationStage>> {
    const errStage = new OpenStackAllocationStage();
    errStage.id = stageId;
    return of(new StageDetailBasicInfo(errStage, true));
  }

  private handleAnsibleBasicStageError(stageId: number): Observable<StageDetailBasicInfo<AnsibleAllocationStage>> {
    const errStage = new AnsibleAllocationStage();
    errStage.id = stageId;
    return of(new StageDetailBasicInfo(errStage, true));
  }
}
