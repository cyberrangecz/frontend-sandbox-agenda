import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { Request } from 'kypo-sandbox-model';
import { Observable, Subject, timer } from 'rxjs';
import { retryWhen, switchMap } from 'rxjs/operators';
import { PoolRequestsService } from './pool-requests.service';

/**
 * Service extending pool request service of polling behaviour
 */
export abstract class PoolRequestsPollingService extends PoolRequestsService {
  /**
   * Must be set up before polling starts
   */
  protected lastPoolId: number;
  /**
   * @contract must be updated on pagination change
   */
  protected lastPagination: KypoRequestedPagination;
  /**
   * Emission causes polling to start again
   */
  protected retryPolling$: Subject<boolean> = new Subject();
  /**
   * Emits received data with every new poll response
   */
  protected poll$: Observable<KypoPaginatedResource<Request>>;

  private pollPeriod: number;

  protected constructor(defaultPaginationSize: number, pollPeriod: number) {
    super(defaultPaginationSize);
    this.pollPeriod = pollPeriod;
    this.poll$ = this.createPoll();
  }

  /**
   * Repeats last recorded request
   */
  protected abstract repeatLastGetAllRequest(): Observable<KypoPaginatedResource<Request>>;

  /**
   * Updates polling info when request is made manually (by changing pagination for example) and delays poll period
   * @param poolId id of a pool associated with requests
   * @param pagination requested pagination
   */
  protected onManualGetAll(poolId: number, pagination: KypoRequestedPagination) {
    this.lastPoolId = poolId;
    this.lastPagination = pagination;
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
  }

  private createPoll(): Observable<KypoPaginatedResource<Request>> {
    return timer(this.pollPeriod, this.pollPeriod).pipe(
      switchMap((_) => this.repeatLastGetAllRequest()),
      retryWhen((_) => this.retryPolling$)
    );
  }
}
