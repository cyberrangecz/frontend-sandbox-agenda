import { KypoRequestedPagination } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { RequestStageType } from 'kypo-sandbox-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Dictionary } from 'typescript-collections';
import { StageDetailState } from '../../../model/stage/stage-detail-state';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * Subscribe to stageDetail$ to receive latest data updates.
 */
export abstract class StageDetailService {
  protected subscribedStageDetails: Dictionary<number, StageDetailState> = new Dictionary();

  protected stageDetailsSubject$: BehaviorSubject<StageDetailState[]> = new BehaviorSubject([]);

  /**
   * @contract must be updated every time new data are received
   */
  stageDetails$: Observable<StageDetailState[]> = this.stageDetailsSubject$.asObservable();

  /**
   * Registers a stage to a list of subscribed stages (to get its details)
   * @param stage a stage to to register
   * @param additionalInfoPagination optional list of pagination requested for stage additional info (ORDER MATTERS)
   */
  register(stage: RequestStage, additionalInfoPagination?: KypoRequestedPagination[]): Observable<any> {
    return this.getStageDetail(stage.requestId, stage.type, additionalInfoPagination).pipe(
      tap(
        (stageDetail) => {
          this.subscribedStageDetails.setValue(stage.id, stageDetail);
          return this.stageDetailsSubject$.next(this.subscribedStageDetails.values());
        },
        (_) => {
          return this.stageDetailsSubject$.next(this.subscribedStageDetails.values());
        }
      )
    );
  }

  /**
   * Unregisters a stage from a list of subscribed stages (to stop getting its details)
   * @param stage a stage to unsubscribe
   */
  unregister(stage: RequestStage): void {
    this.subscribedStageDetails.remove(stage.id);
  }

  /**
   * @param requestId id of request associated with stages
   * @param stageType type of stage
   * @param additionalInfoPagination list of requested pagination of additional info of stage detail
   */
  abstract getStageDetail(
    requestId: number,
    stageType: RequestStageType,
    additionalInfoPagination?: KypoRequestedPagination[]
  ): Observable<StageDetailState>;
}
