import { combineLatest, merge, Observable, of, Subject, timer } from 'rxjs';
import { publishReplay, refCount, retryWhen, switchMap } from 'rxjs/operators';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
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

  private createPoll(): Observable<StageDetailState[]> {
    return timer(this.pollPeriod, this.pollPeriod).pipe(
      switchMap((_) => this.refreshSubscribed()),
      retryWhen((_) => this.retryPolling$)
    );
  }

  private refreshSubscribed(): Observable<StageDetailState[]> {
    const subscribedStageDetailValues = this.subscribedStageDetails.values();
    const stageDetails$ = this.getValuesOfFinished(subscribedStageDetailValues).concat(
      this.getValuesOfRunning(subscribedStageDetailValues)
    );
    return combineLatest(stageDetails$);
  }

  private getValuesOfFinished(stageDetails: StageDetailState[]): Observable<StageDetailState>[] {
    return stageDetails
      .filter((stageDetail) => !stageDetail.basicInfo.stage.isRunning())
      .map((stageDetail) => of(stageDetail));
  }

  private getValuesOfRunning(stageDetails: StageDetailState[]): Observable<StageDetailState>[] {
    return stageDetails
      .filter((stageDetail) => stageDetail.basicInfo.stage.isRunning())
      .map((stageDetail) =>
        this.getStageDetail(
          stageDetail.basicInfo.stage.requestId,
          stageDetail.basicInfo.stage.type,
          stageDetail.additionalInfo.map((additional) => additional.requestedPagination)
        )
      );
  }
}
