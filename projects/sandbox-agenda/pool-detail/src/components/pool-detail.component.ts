import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool, RequestStageState } from '@cyberrangecz-platform/sandbox-model';
import { TableActionEvent, TableLoadEvent } from '@sentinel/components/table';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { POOL_DATA_ATTRIBUTE_NAME, SandboxNavigator } from '@cyberrangecz-platform/sandbox-agenda';
import { PaginationService, ResourcePollingService } from '@cyberrangecz-platform/sandbox-agenda/internal';
import { AllocationRequestsService } from '../services/state/request/allocation/requests/allocation-requests.service';
import { CleanupRequestsService } from '../services/state/request/cleanup/cleanup-requests.service';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';
import { PoolDetailControls } from './pool-detail-controls';
import { AllocationRequestsConcreteService } from '../services/state/request/allocation/requests/allocation-requests-concrete.service';
import { CleanupRequestsConcreteService } from '../services/state/request/cleanup/cleanup-requests-concrete.service';
import { SandboxInstanceConcreteService } from '../services/state/sandbox-instance/sandbox-instance-concrete.service';
import { PoolDetailTable } from '../model/pool-detail-table';
import { AbstractSandbox } from '../model/abstract-sandbox';
import { SelectedStage } from '../model/selected-stage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Smart component of pool detail page
 */
@Component({
  selector: 'crczp-pool-detail',
  templateUrl: './pool-detail.component.html',
  styleUrls: ['./pool-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ResourcePollingService,
    { provide: AllocationRequestsService, useClass: AllocationRequestsConcreteService },
    { provide: CleanupRequestsService, useClass: CleanupRequestsConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
  ],
})
export class PoolDetailComponent implements OnInit, AfterViewInit {
  @Input() paginationId = 'crczp-pool-detail';
  pool: Pool;
  instances$: Observable<PoolDetailTable>;
  instancesTableHasError$: Observable<boolean>;
  controls: SentinelControlItem[];
  commentTrim = 15;
  destroyRef = inject(DestroyRef);
  private subscription: Subscription;

  readonly DEFAULT_SORT_COLUMN = 'id';
  readonly DEFAULT_SORT_DIRECTION = 'asc';

  constructor(
    private sandboxInstanceService: SandboxInstanceService,
    private paginationService: PaginationService,
    private navigator: SandboxNavigator,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initTables();
    this.initControls();
  }

  ngAfterViewInit() {
    this.computeCommentTrim();
  }

  /**
   * Gets new data for sandbox instance overview table
   * @param loadEvent load event emitted from sandbox instances table
   */
  onLoadEvent(loadEvent: TableLoadEvent): void {
    this.paginationService.setPagination(this.paginationId, loadEvent.pagination.size);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sandboxInstanceService
      .getAllUnits(this.pool.id, loadEvent.pagination)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onControlsAction(control: SentinelControlItem): void {
    control.result$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /**
   * Subscribes to result of a table action event
   * @param event action event emitted from table component
   */
  onTableAction(event: TableActionEvent<any>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  onStageAction(selectedStage: SelectedStage): void {
    if (selectedStage.state === RequestStageState.RETRY) {
      this.sandboxInstanceService.retryAllocate(selectedStage.unitId).pipe(take(1)).subscribe();
    }
    this.sandboxInstanceService
      .navigateToStage(this.pool.id, selectedStage.unitId, selectedStage.order)
      .pipe(take(1))
      .subscribe();
  }

  private initTables() {
    const initialLoadEvent: TableLoadEvent = {
      pagination: new OffsetPaginationEvent(
        0,
        this.paginationService.getPagination(this.paginationId),
        this.DEFAULT_SORT_COLUMN,
        this.DEFAULT_SORT_DIRECTION,
      ),
    };
    this.activeRoute.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.pool = data[POOL_DATA_ATTRIBUTE_NAME];
      this.onLoadEvent(initialLoadEvent);
    });

    this.instances$ = this.sandboxInstanceService.allocationUnits$.pipe(
      map((resource) => {
        const data = resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit));
        return new PoolDetailTable(
          new PaginatedResource<AbstractSandbox>(data, resource.pagination),
          this.sandboxInstanceService,
          this.navigator,
        );
      }),
    );
  }

  private initControls() {
    const sandboxes$ = this.sandboxInstanceService.allocationUnits$.pipe(
      map((resource) => {
        this.controls = PoolDetailControls.create(
          this.pool,
          resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit)),
          this.sandboxInstanceService,
        );
        return resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit));
      }),
    );
    sandboxes$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /**
   * Dynamically compute the length of comment to display
   */
  computeCommentTrim() {
    const element = document.querySelector('.cdk-column-comment');
    const columnWidth = parseFloat(getComputedStyle(element)['width']);
    const fontSize = 9.5;
    this.commentTrim = +(columnWidth / fontSize).toFixed();
  }
}
