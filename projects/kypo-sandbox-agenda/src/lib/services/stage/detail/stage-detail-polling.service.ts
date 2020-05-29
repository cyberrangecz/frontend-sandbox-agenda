import { combineLatest, merge, Observable, of, Subject, timer } from 'rxjs';
import { publishReplay, refCount, retryWhen, switchMap, tap } from 'rxjs/operators';
import { StageDetail } from '../../../model/stage/stage-detail-adapter';
import { StageDetailService } from './stage-detail.service';

export abstract class StageDetailPollingService extends StageDetailService {
  protected retryPolling$: Subject<boolean> = new Subject();

  private pollPeriod: number;

  protected constructor(pollPeriod: number) {
    super();
    this.pollPeriod = pollPeriod;
    this.stageDetails$ = merge(this.createPoll(), this.stageDetailsSubject$.asObservable()).pipe(
      publishReplay(1),
      refCount()
    );
  }

  private createPoll(): Observable<StageDetail[]> {
    return timer(this.pollPeriod, this.pollPeriod).pipe(
      switchMap((_) => this.refreshSubscribed()),
      retryWhen((_) => this.retryPolling$)
    );
  }

  private refreshSubscribed(): Observable<StageDetail[]> {
    const subscribedStageDetailValues = this.subscribedStageDetails.values();
    const stageDetails$ = this.getValuesOfFinished(subscribedStageDetailValues).concat(
      this.getValuesOfRunning(subscribedStageDetailValues)
    );
    return combineLatest(stageDetails$);
  }

  private getValuesOfFinished(stageDetails: StageDetail[]): Array<Observable<StageDetail>> {
    return stageDetails.filter((stageDetail) => !stageDetail.stage.isRunning()).map((stageDetail) => of(stageDetail));
  }

  private getValuesOfRunning(stageDetails: StageDetail[]): Array<Observable<StageDetail>> {
    return stageDetails
      .filter((stageDetail) => stageDetail.stage.isRunning())
      .map((stageDetail) =>
        this.getStageDetail(stageDetail.stage.id, stageDetail.stage.type, stageDetail.requestedPagination)
      );
  }
}
