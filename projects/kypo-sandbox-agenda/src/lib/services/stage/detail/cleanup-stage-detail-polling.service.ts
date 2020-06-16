import { Injectable } from '@angular/core';
import { StagesApi } from 'kypo-sandbox-api';
import { AnsibleCleanupStage, OpenStackCleanupStage, RequestStageType } from 'kypo-sandbox-model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CleanupStageDetailState } from '../../../model/stage/cleanup-stage-detail-state';
import { StageDetailBasicInfo } from '../../../model/stage/stage-detail-basic-info';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { StageDetailPollingService } from './stage-detail-polling.service';

@Injectable()
export class CleanupStageDetailPollingService extends StageDetailPollingService {
  constructor(private api: StagesApi, private context: SandboxAgendaContext) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(stageId: number, stageType: RequestStageType): Observable<StageDetailState> {
    let stage$: Observable<StageDetailState>;
    if (stageType === RequestStageType.OPENSTACK_CLEANUP) {
      stage$ = this.createOpenstackStageState(stageId);
    } else if (stageType === RequestStageType.ANSIBLE_CLEANUP) {
      stage$ = this.createAnsibleStageState(stageId);
    } else {
      return throwError(
        new Error(`Request stage of type "${stageType}" is not supported by CleanupStageDetailPollingService`)
      );
    }
    return stage$;
  }

  private createOpenstackStageState(stageId: number): Observable<StageDetailState> {
    return this.api.getOpenstackCleanupStage(stageId).pipe(
      map((stage) => new CleanupStageDetailState(new StageDetailBasicInfo(stage))),
      catchError((err) => this.handleOpenstackStageError(stageId))
    );
  }

  private createAnsibleStageState(stageId: number): Observable<StageDetailState> {
    return this.api.getAnsibleCleanupStage(stageId).pipe(
      map((stage) => new CleanupStageDetailState(new StageDetailBasicInfo(stage))),
      catchError((err) => this.handleAnsibleStageError(stageId))
    );
  }

  private handleOpenstackStageError(stageId: number): Observable<CleanupStageDetailState> {
    const errStage = new OpenStackCleanupStage();
    errStage.id = stageId;
    return of(new CleanupStageDetailState(new StageDetailBasicInfo(errStage, true)));
  }

  private handleAnsibleStageError(stageId: number): Observable<CleanupStageDetailState> {
    const errStage = new AnsibleCleanupStage();
    errStage.id = stageId;
    return of(new CleanupStageDetailState(new StageDetailBasicInfo(errStage, true)));
  }
}
