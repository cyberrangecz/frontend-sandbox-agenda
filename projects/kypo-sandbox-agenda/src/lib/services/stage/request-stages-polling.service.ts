import {RequestStagesService} from './request-stages.service';
import {merge, Observable, Subject, timer} from 'rxjs';
import {KypoPaginatedResource} from 'kypo-common';
import {RequestStage} from 'kypo-sandbox-model';
import {retryWhen, switchMap} from 'rxjs/operators';
import {Request} from 'kypo-sandbox-model';

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
    return timer(0, this.pollPeriod)
      .pipe(
        switchMap(_ => this.repeatLastGetAllRequest()),
        retryWhen(_ => this.retryPolling$),
      );
  }

}

