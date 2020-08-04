import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SentinelBaseDirective, RequestedPagination, PaginatedResource } from '@sentinel/common';
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
export class OpenStackAllocationStageDetailComponent extends SentinelBaseDirective implements OnInit, OnChanges {
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

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.stage && 'stage' in changes && changes['stage'].isFirstChange()) {
      this.init();
    }
  }

  init() {
    const initialPagination = new RequestedPagination(0, 500, '', '');
    this.onFetchEvents(initialPagination);
    this.onFetchResources(initialPagination);

    this.events$ = this.eventsService.resource$.pipe(takeWhile((_) => this.isAlive));
    this.hasEvents$ = this.events$.pipe(map((events) => events.elements.length > 0));
    this.eventsIsLoading$ = this.eventsService.isLoading$.pipe(takeWhile((_) => this.isAlive));
    this.eventsHasError$ = this.eventsService.hasError$.pipe(takeWhile((_) => this.isAlive));

    this.resources$ = this.resourcesService.resource$.pipe(takeWhile((_) => this.isAlive));
    this.hasResources$ = this.resources$.pipe(map((resources) => resources.elements.length > 0));
    this.resourcesIsLoading$ = this.resourcesService.isLoading$.pipe(takeWhile((_) => this.isAlive));
    this.resourcesHasError$ = this.resourcesService.hasError$.pipe(takeWhile((_) => this.isAlive));
  }

  onFetchEvents(requestedPagination: RequestedPagination) {
    this.eventsService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  onFetchResources(requestedPagination: RequestedPagination) {
    this.resourcesService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }
}
