import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { SandboxInstance } from 'kypo-sandbox-model';
import { Observable, Subject, timer } from 'rxjs';
import { retryWhen, switchMap } from 'rxjs/operators';
import { SandboxInstanceService } from './sandbox-instance.service';

export abstract class SandboxInstancePollingService extends SandboxInstanceService {
  protected lastPoolId: number;

  protected lastPagination: KypoRequestedPagination;

  protected retryPolling$: Subject<boolean> = new Subject();

  protected poll$: Observable<KypoPaginatedResource<SandboxInstance>>;

  private pollPeriod: number;

  protected constructor(defaultPaginationSize: number, pollPeriod: number) {
    super(defaultPaginationSize);
    this.pollPeriod = pollPeriod;
    this.poll$ = this.createPoll();
  }

  protected abstract repeatLastGetAll(): Observable<KypoPaginatedResource<SandboxInstance>>;

  protected onManualGetAll(poolId: number, pagination: KypoRequestedPagination) {
    this.lastPoolId = poolId;
    this.lastPagination = pagination;
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
  }

  private createPoll(): Observable<KypoPaginatedResource<SandboxInstance>> {
    return timer(this.pollPeriod, this.pollPeriod).pipe(
      switchMap((_) => this.repeatLastGetAll()),
      retryWhen((_) => this.retryPolling$)
    );
  }
}
