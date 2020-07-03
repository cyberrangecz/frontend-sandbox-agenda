import { Injectable } from '@angular/core';
import {
  NetworkingAnsibleCleanupStage,
  OpenStackCleanupStage,
  RequestStageType,
  UserAnsibleCleanupStage,
} from 'kypo-sandbox-model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CleanupStageDetailState } from '../../../model/stage/cleanup-stage-detail-state';
import { StageDetailBasicInfo } from '../../../model/stage/stage-detail-basic-info';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { StageDetailPollingService } from './stage-detail-polling.service';
import { CleanupRequestsApi } from 'kypo-sandbox-api';

@Injectable()
export class CleanupStageDetailPollingService extends StageDetailPollingService {
  constructor(private api: CleanupRequestsApi, private context: SandboxAgendaContext) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(requestId: number, stageType: RequestStageType): Observable<StageDetailState> {
    switch (stageType) {
      case RequestStageType.OPEN_STACK_CLEANUP: {
        return this.createOpenStackStageState(requestId);
      }
      case RequestStageType.NETWORKING_ANSIBLE_CLEANUP: {
        return this.createNetworkingAnsibleStageState(requestId);
      }
      case RequestStageType.USER_ANSIBLE_CLEANUP: {
        return this.createUserAnsibleStageState(requestId);
      }
      default: {
        return throwError(
          new Error(`Request stage of type "${stageType}" is not supported by CleanupStageDetailPollingService`)
        );
      }
    }
  }

  private createOpenStackStageState(requestId: number): Observable<StageDetailState> {
    return this.api.getOpenStackStage(requestId).pipe(
      map((stage) => new CleanupStageDetailState(new StageDetailBasicInfo(stage))),
      catchError((err) => this.handleOpenstackStageError(requestId))
    );
  }

  private createNetworkingAnsibleStageState(requestId: number): Observable<StageDetailState> {
    return this.api.getNetworkingAnsibleStage(requestId).pipe(
      map((stage) => new CleanupStageDetailState(new StageDetailBasicInfo(stage))),
      catchError((err) => this.handleNetworkingAnsibleStageError(requestId))
    );
  }

  private createUserAnsibleStageState(requestId: number): Observable<StageDetailState> {
    return this.api.getUserAnsibleStage(requestId).pipe(
      map((stage) => new CleanupStageDetailState(new StageDetailBasicInfo(stage))),
      catchError((err) => this.handleUserAnsibleStageError(requestId))
    );
  }

  private handleOpenstackStageError(stageId: number): Observable<CleanupStageDetailState> {
    const errStage = new OpenStackCleanupStage();
    errStage.id = stageId;
    return of(new CleanupStageDetailState(new StageDetailBasicInfo(errStage, true)));
  }

  private handleNetworkingAnsibleStageError(stageId: number): Observable<CleanupStageDetailState> {
    const errStage = new NetworkingAnsibleCleanupStage();
    errStage.id = stageId;
    return of(new CleanupStageDetailState(new StageDetailBasicInfo(errStage, true)));
  }

  private handleUserAnsibleStageError(stageId: number): Observable<CleanupStageDetailState> {
    const errStage = new UserAnsibleCleanupStage();
    errStage.id = stageId;
    return of(new CleanupStageDetailState(new StageDetailBasicInfo(errStage, true)));
  }
}
