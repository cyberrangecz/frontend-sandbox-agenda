import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SentinelBaseDirective, OffsetPaginationEvent, PaginatedResource } from '@sentinel/common';
import { OpenStackStageAdapter } from '../../../../model/adapters/open-stack-stage-adapter';
import { Observable } from 'rxjs';
import { OpenStackEventsService } from '../../../../services/state/detail/open-stack-events.service';
import { OpenStackResourcesService } from '../../../../services/state/detail/open-stack-resources.service';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'kypo-open-stack-allocation-stage-detail',
  templateUrl: './open-stack-allocation-stage-detail.component.html',
  styleUrls: ['./open-stack-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OpenStackEventsService, OpenStackResourcesService],
})
export class OpenStackAllocationStageDetailComponent extends SentinelBaseDirective implements OnChanges {
  @Input() stage: OpenStackStageAdapter;

  events$: Observable<PaginatedResource<string>>;
  hasEvents$: Observable<boolean>;
  eventsIsLoading$: Observable<boolean>;
  eventsHasError$: Observable<boolean>;

  resources$: Observable<PaginatedResource<string>>;
  hasResources$: Observable<boolean>;
  resourcesIsLoading$: Observable<boolean>;
  resourcesHasError$: Observable<boolean>;

  constructor(private eventsService: OpenStackEventsService, private resourcesService: OpenStackResourcesService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stage && 'stage' in changes && changes['stage'].isFirstChange()) {
      this.init();
    }
  }

  init(): void {
    const initialPagination = new OffsetPaginationEvent(0, 500, '', '');
    this.onFetchEvents(initialPagination);
    this.onFetchResources(initialPagination);

    this.events$ = this.eventsService.resource$.pipe(takeWhile(() => this.isAlive));
    this.hasEvents$ = this.events$.pipe(map((events) => events.elements.length > 0));
    this.eventsIsLoading$ = this.eventsService.isLoading$.pipe(takeWhile(() => this.isAlive));
    this.eventsHasError$ = this.eventsService.hasError$.pipe(takeWhile(() => this.isAlive));

    this.resources$ = this.resourcesService.resource$.pipe(takeWhile(() => this.isAlive));
    this.hasResources$ = this.resources$.pipe(map((resources) => resources.elements.length > 0));
    this.resourcesIsLoading$ = this.resourcesService.isLoading$.pipe(takeWhile(() => this.isAlive));
    this.resourcesHasError$ = this.resourcesService.hasError$.pipe(takeWhile(() => this.isAlive));
  }

  onFetchEvents(requestedPagination: OffsetPaginationEvent): void {
    this.eventsService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  onFetchResources(requestedPagination: OffsetPaginationEvent): void {
    this.resourcesService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }
}
