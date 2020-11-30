import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { Request } from 'kypo-sandbox-model';
import { RequestStage } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { POOL_REQUEST_DATA_ATTRIBUTE_NAME } from '@kypo/sandbox-agenda';
import { RequestStagesService } from '../../services/state/request-stages.service';
import { StageAdapter } from '../../model/adapters/stage-adapter';
import { StagesDetailPollRegistry } from '../../services/state/detail/stages-detail-poll-registry.service';

/**
 * Smart component for pool request detail page
 */
export abstract class RequestDetailComponent extends SentinelBaseDirective {
  request$: Observable<Request>;
  stages$: Observable<StageAdapter[]>;
  hasError$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  private request: Request;

  protected constructor(
    protected activeRoute: ActivatedRoute,
    protected requestStagesService: RequestStagesService,
    protected stageDetailRegistry?: StagesDetailPollRegistry
  ) {
    super();
    this.init();
  }
  /**
   * Helper method to improve performance of *ngFor directive
   * @param index index of pool request stage
   * @param item selected stage
   */
  trackByFn(index: number, item: RequestStage) {
    return item.id;
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

  onStageDetailPanelChange(opened: boolean, stage: RequestStage) {
    if (opened) {
      this.stageDetailRegistry.add(stage);
    } else {
      this.stageDetailRegistry.remove(stage);
    }
  }

  private init() {
    this.stages$ = this.requestStagesService.stages$;
    this.hasError$ = this.requestStagesService.hasError$;
    this.isLoading$ = this.requestStagesService.isLoading$;

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
