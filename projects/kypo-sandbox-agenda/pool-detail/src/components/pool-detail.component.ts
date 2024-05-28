import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool, RequestStageState } from '@muni-kypo-crp/sandbox-model';
import { TableActionEvent, TableLoadEvent } from '@sentinel/components/table';
import { Observable, Subscription } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { POOL_DATA_ATTRIBUTE_NAME, SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { PaginationService, ResourcePollingService } from '@muni-kypo-crp/sandbox-agenda/internal';
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

/**
 * Smart component of pool detail page
 */
@Component({
  selector: 'kypo-pool-detail',
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
export class PoolDetailComponent extends SentinelBaseDirective implements OnInit, AfterViewInit {
  pool: Pool;
  instances$: Observable<PoolDetailTable>;
  instancesTableHasError$: Observable<boolean>;
  controls: SentinelControlItem[];
  commentTrim = 15;
  private subscription: Subscription;
  private trimSpace = 8;

  constructor(
    private sandboxInstanceService: SandboxInstanceService,
    private paginationService: PaginationService,
    private navigator: SandboxNavigator,
    private activeRoute: ActivatedRoute
  ) {
    super();
  }

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
    this.paginationService.setPagination(loadEvent.pagination.size);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sandboxInstanceService
      .getAllUnits(this.pool.id, loadEvent.pagination)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  onControlsAction(control: SentinelControlItem): void {
    control.result$.pipe(takeWhile(() => this.isAlive)).subscribe();
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
      pagination: new OffsetPaginationEvent(0, this.paginationService.getPagination(), '', 'asc'),
    };
    this.activeRoute.data.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
      this.pool = data[POOL_DATA_ATTRIBUTE_NAME];
      this.onLoadEvent(initialLoadEvent);
    });

    this.instances$ = this.sandboxInstanceService.allocationUnits$.pipe(
      map((resource) => {
        const data = resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit));
        return new PoolDetailTable(
          new PaginatedResource<AbstractSandbox>(data, resource.pagination),
          this.sandboxInstanceService,
          this.navigator
        );
      })
    );
  }

  private initControls() {
    const sandboxes$ = this.sandboxInstanceService.allocationUnits$.pipe(
      map((resource) => {
        this.controls = PoolDetailControls.create(
          this.pool,
          resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit)),
          this.sandboxInstanceService
        );
        return resource.elements.map((allocationUnit) => new AbstractSandbox(allocationUnit));
      })
    );
    sandboxes$.pipe(takeWhile(() => this.isAlive)).subscribe();
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
