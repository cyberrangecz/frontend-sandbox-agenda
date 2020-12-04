import { merge, NEVER, Observable } from 'rxjs';
import { PaginatedResource, PaginatedResourcePollingService, RequestedPagination } from '@sentinel/common';
import { RequestStage } from '@muni-kypo-crp/sandbox-model';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { StagesDetailPollRegistry } from './stages-detail-poll-registry.service';

export abstract class StageDetailService extends PaginatedResourcePollingService<string> {
  private lastStage: RequestStage;
  protected constructor(protected pollRegistry: StagesDetailPollRegistry, pageSize: number, pollingPeriod: number) {
    super(pageSize, pollingPeriod);
    this.resource$ = merge(this.resourceSubject$.asObservable(), this.createStoppablePoll(pollingPeriod));
  }

  getAll(stage: RequestStage, requestedPagination: RequestedPagination) {
    this.onManualResourceRefresh(requestedPagination, stage);
    return this.callApiToGetStageDetail(stage, requestedPagination).pipe(
      tap(
        (resource) => this.resourceSubject$.next(resource),
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected createStoppablePoll(pollingPeriod: number): Observable<PaginatedResource<string>> {
    const shouldBePolled$ = this.pollRegistry.polledStageIds$.pipe(
      map((polledIds) => polledIds.includes(this.lastStage.id))
    );
    return shouldBePolled$.pipe(
      filter((shouldBePolled) => shouldBePolled),
      switchMap((_) => this.refreshResource()),
      shareReplay(Number.POSITIVE_INFINITY, pollingPeriod)
    );
  }

  protected onManualResourceRefresh(pagination: RequestedPagination, ...params) {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastStage = params[0];
  }
  protected refreshResource(): Observable<PaginatedResource<string>> {
    this.hasErrorSubject$.next(false);
    return this.callApiToGetStageDetail(this.lastStage, this.lastPagination).pipe(
      tap({ error: (err) => this.onGetAllError(err) })
    );
  }

  protected onGetAllError(err: HttpErrorResponse) {
    this.hasErrorSubject$.next(true);
  }

  protected abstract callApiToGetStageDetail(
    stage: RequestStage,
    requestedPagination: RequestedPagination
  ): Observable<PaginatedResource<string>>;
}
