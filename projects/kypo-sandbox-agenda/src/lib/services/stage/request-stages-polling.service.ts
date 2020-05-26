import { KypoPaginatedResource } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { merge, Observable, Subject, timer } from 'rxjs';
import { retryWhen, switchMap, takeWhile } from 'rxjs/operators';
import { RequestStagesService } from './request-stages.service';

export abstract class RequestStagesPollingService extends RequestStagesService {
  protected request: Request;
  protected retryPolling$: Subject<boolean> = new Subject();

  private pollPeriod: number;

  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize);
    this.pollPeriod = pollPeriod;
  }

  protected abstract repeatLastGetAllRequest(): Observable<KypoPaginatedResource<RequestStage>>;

  /**
   * Starts polling with ids and info passed as arguments
   * @param request request associated with stages
   */
  startPolling(request: Request) {
    this.request = request;
    const poll$ = this.createPoll();
    this.resource$ = merge(poll$, this.resourceSubject$.asObservable());
  }

  protected createPoll(): Observable<KypoPaginatedResource<RequestStage>> {
    return timer(0, this.pollPeriod).pipe(
      switchMap((_) => this.repeatLastGetAllRequest()),
      retryWhen((_) => this.retryPolling$),
      takeWhile((data) => !this.stagesFinished(data.elements) && !this.stageFailed(data.elements), true)
    );
  }

  private stagesFinished(data: RequestStage[]): boolean {
    return data.every((stage) => stage.hasFinished());
  }

  private stageFailed(data: RequestStage[]): boolean {
    return data.some((stage) => stage.hasFailed());
  }
}
