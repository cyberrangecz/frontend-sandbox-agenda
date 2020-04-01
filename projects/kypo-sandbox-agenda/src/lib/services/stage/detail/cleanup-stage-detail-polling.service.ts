import {StageDetailPollingService} from './stage-detail-polling.service';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {RequestStageType} from 'kypo-sandbox-model';
import {RequestStage} from 'kypo-sandbox-model';
import {map} from 'rxjs/operators';
import {StagesApi} from 'kypo-sandbox-api';
import {StageDetail} from '../../../model/stage/stage-detail-adapter';
import {SandboxErrorHandler} from '../../client/sandbox-error.handler';
import {SandboxAgendaContext} from '../../internal/sandox-agenda-context.service';

@Injectable()
export class CleanupStageDetailPollingService extends StageDetailPollingService {

  constructor(private api: StagesApi,
              private context: SandboxAgendaContext,
              private errorHandler: SandboxErrorHandler) {
    super(context.config.pollingPeriod);
  }

  getStageDetail(stageId: number, stageType: RequestStageType): Observable<StageDetail> {
    let stage$: Observable<RequestStage>;
    if (stageType === RequestStageType.OPENSTACK_CLEANUP) {
      stage$ = this.api.getOpenstackCleanupStage(stageId);
    } else if (stageType === RequestStageType.ANSIBLE_CLEANUP) {
      stage$ = this.api.getAnsibleCleanupStage(stageId);
    } else {
      return throwError(new Error(`Request stage of type "${stageType}" is not supported by CleanupStageDetailPollingService`));
    }
    return stage$
      .pipe(
        map(stage => new StageDetail(stage),
          err => {
            this.errorHandler.emit(err, `Fetching stage ${stageId} detail`);
            return new StageDetail(undefined, true);
          }),
      );
  }
}
