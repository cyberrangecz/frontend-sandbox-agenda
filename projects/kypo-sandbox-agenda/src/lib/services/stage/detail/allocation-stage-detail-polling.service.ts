import { Injectable } from '@angular/core';
import { KypoRequestedPagination } from 'kypo-common';
import { StagesApi } from 'kypo-sandbox-api';
import { RequestStageType } from 'kypo-sandbox-model';
import { Observable, throwError, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { StageDetail } from '../../../model/stage/stage-detail-adapter';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { StageDetailPollingService } from './stage-detail-polling.service';

/**
 * Service extending stage detail service of polling behaviour.
 * Stages must bust be first subscribed to be added to a list of polled stages.
 */
@Injectable()
export class AllocationStageDetailPollingService extends StageDetailPollingService {
  constructor(
    private api: StagesApi,
    private context: SandboxAgendaContext,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(
    stageId: number,
    stageType: RequestStageType,
    pagination?: KypoRequestedPagination
  ): Observable<StageDetail> {
    if (stageType === RequestStageType.OPENSTACK_ALLOCATION) {
      return this.getOpenstackStageDetail(stageId);
    } else if (stageType === RequestStageType.ANSIBLE_ALLOCATION) {
      return this.getAnsibleDetail(stageId, pagination);
    } else {
      return throwError(
        new Error(`Request stage of type "${stageType}" is not supported by AllocationStageDetailPollingService`)
      );
    }
  }

  private getOpenstackStageDetail(stageId: number): Observable<StageDetail> {
    return this.api.getOpenstackAllocationStage(stageId).pipe(
      map(
        (stage) => new StageDetail(stage),
        (err) => {
          this.errorHandler.emit(err, `Fetching stage ${stageId} detail`);
          return new StageDetail(undefined, true);
        }
      )
    );
  }

  private getAnsibleDetail(stageId: number, outputPagination: KypoRequestedPagination): Observable<StageDetail> {
    if (!outputPagination) {
      outputPagination = new KypoRequestedPagination(0, 500, '', '');
    }
    return zip(
      this.api.getAnsibleAllocationStage(stageId),
      this.api.getAnsibleAllocationStageOutput(stageId, outputPagination)
    ).pipe(
      map((results) => {
        results[0].output = results[1];
        const stageDetail = new StageDetail(results[0]);
        stageDetail.requestedPagination = outputPagination;
        return stageDetail;
      })
    );
  }
}
