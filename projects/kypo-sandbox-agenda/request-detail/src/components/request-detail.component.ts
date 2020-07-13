import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { Request } from 'kypo-sandbox-model';
import { RequestStage } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { POOL_REQUEST_DATA_ATTRIBUTE_NAME } from 'kypo-sandbox-agenda';
import { StageDetailEventType } from '../model/stage-detail-event-type';
import { StageDetailPanelEvent } from '../model/stage-detail-panel-event';
import { StageDetailState } from '../model/stage-detail-state';
import { StageDetailService } from '../services/state/detail/stage-detail.service';
import { RequestStagesService } from '../services/state/request-stages.service';

/**
 * Smart component for pool request detail page
 */
@Component({
  selector: 'kypo-pool-requests',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailComponent extends SentinelBaseDirective implements OnInit {
  request$: Observable<Request>;
  stages$: Observable<RequestStage[]>;
  stageDetails$: Observable<StageDetailState[]>;
  hasError$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  private request: Request;
  private lastStageDetails: StageDetailState[] = [];

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
    return this.lastStageDetails.findIndex((stageDetail) => stageDetail.basicInfo.stage.id === id);
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
  onStageDetailPanelEvent(event: StageDetailPanelEvent) {
    if (event.type === StageDetailEventType.OPEN) {
      this.stageDetailService
        .register(event.stage)
        .pipe(takeWhile((_) => this.isAlive))
        .subscribe();
    } else {
      this.stageDetailService.unregister(event.stage);
    }
  }

  onFetchStageDetail(stageDetail: StageDetailState) {
    this.stageDetailService
      .register(
        stageDetail.basicInfo.stage,
        stageDetail.additionalInfo.map((info) => info.requestedPagination)
      )
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  private init() {
    this.stages$ = this.requestStagesService.stages$;
    this.hasError$ = this.requestStagesService.hasError$;
    this.isLoading$ = this.requestStagesService.isLoading$;
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
