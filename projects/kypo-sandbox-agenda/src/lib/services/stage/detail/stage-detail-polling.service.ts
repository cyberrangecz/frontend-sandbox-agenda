import {StageDetailService} from './stage-detail.service';
import {combineLatest, merge, Observable, Subject, timer} from 'rxjs';
import {retryWhen, switchMap} from 'rxjs/operators';
import {StageDetail} from '../../../model/stage/stage-detail-adapter';

export abstract class StageDetailPollingService extends StageDetailService {
  protected retryPolling$: Subject<boolean> = new Subject();

  private pollPeriod: number;

  protected constructor(pollPeriod: number) {
    super();
    this.pollPeriod = pollPeriod;
    this.stageDetails$ = merge(this.createPoll(), this.stageDetailsSubject$.asObservable());
  }

  private createPoll(): Observable<StageDetail[]> {
    return timer(this.pollPeriod, this.pollPeriod)
      .pipe(
        switchMap(_ => this.refreshSubscribed()),
        retryWhen(_ => this.retryPolling$),
      );
  }

  private refreshSubscribed(): Observable<StageDetail[]> {
    const stageDetails$ = this.subscribedStageDetails.values()
      .map(stageDetail => this.getStageDetail(stageDetail.stage.id, stageDetail.stage.type, stageDetail.requestedPagination));
    return combineLatest(stageDetails$);
  }
}
