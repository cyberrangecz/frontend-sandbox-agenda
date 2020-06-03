import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KypoBaseComponent } from 'kypo-common';
import { Request } from 'kypo-sandbox-model';
import { RequestStage } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { POOL_REQUEST_DATA_ATTRIBUTE_NAME } from '../../model/client/activated-route-data-attributes';
import { StageDetail } from '../../model/stage/stage-detail-adapter';
import { StageDetailEvent } from '../../model/stage/stage-detail-event';
import { StageDetailEventType } from '../../model/stage/stage-detail-event-type';
import { StageDetailService } from '../../services/stage/detail/stage-detail.service';
import { RequestStagesService } from '../../services/stage/request-stages.service';
/**
 * Smart component for pool request detail page
 */
@Component({
  selector: 'kypo-pool-requests',
  templateUrl: './pool-request-detail.component.html',
  styleUrls: ['./pool-request-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoolRequestDetailComponent extends KypoBaseComponent implements OnInit {
  request$: Observable<Request>;
  stages$: Observable<RequestStage[]>;
  stageDetails$: Observable<StageDetail[]>;
  hasError$: Observable<boolean>;

  private request: Request;
  private lastStageDetails: StageDetail[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private stageDetailService: StageDetailService,
    private requestStagesService: RequestStagesService
  ) {
    super();
    this.init();
  }

  ngOnInit() {}

  /**
   * Helper method to improve performance of *ngFor directive
   * @param index index of pool request stage
   * @param item selected stage
   */
  trackByFn(index: number, item: RequestStage) {
    return item.id;
  }

  getStageDetailIndex(id: number): number {
    return this.lastStageDetails.findIndex((stageDetail) => stageDetail.stage.id === id);
  }

  /**
   * Reloads stages of pool request
   */
  reloadStages() {
    this.requestStagesService
      .getAll(this.request)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of stage detail event and calls appropriate handler
   * @param event stage detail event emitted from child component (subscribe or unsubscribe)
   */
  onStageDetailEvent(event: StageDetailEvent) {
    if (event.type === StageDetailEventType.OPEN) {
      this.stageDetailService
        .add(event.stage)
        .pipe(takeWhile((_) => this.isAlive))
        .subscribe();
    } else {
      this.stageDetailService.remove(event.stage);
    }
  }

  onFetchStageDetail(stageDetail: StageDetail) {
    this.stageDetailService
      .add(stageDetail.stage, stageDetail.requestedPagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  private init() {
    this.stages$ = this.requestStagesService.resource$.pipe(map((paginatedStages) => paginatedStages.elements));
    this.hasError$ = this.requestStagesService.hasError$;
    this.stageDetails$ = this.stageDetailService.stageDetails$.pipe(takeWhile((_) => this.isAlive));
    this.stageDetails$.subscribe((stageDetails) => (this.lastStageDetails = stageDetails));

    const data$ = this.activeRoute.data;
    this.request$ = data$.pipe(
      tap((data) => {
        this.request = data[POOL_REQUEST_DATA_ATTRIBUTE_NAME];
      }),
      map((data) => data[POOL_REQUEST_DATA_ATTRIBUTE_NAME])
    );
    data$
      .pipe(
        switchMap((data) => this.requestStagesService.getAll(data[POOL_REQUEST_DATA_ATTRIBUTE_NAME])),
        takeWhile((_) => this.isAlive)
      )
      .subscribe();
  }
}
