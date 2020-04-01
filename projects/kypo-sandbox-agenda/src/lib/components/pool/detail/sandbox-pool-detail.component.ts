import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Kypo2Table, LoadTableEvent, TableActionEvent} from 'kypo2-table';
import {SandboxInstance} from 'kypo-sandbox-model';
import {Observable} from 'rxjs';
import {map, take, takeWhile} from 'rxjs/operators';
import {Request} from 'kypo-sandbox-model';
import {Pool} from 'kypo-sandbox-model';
import {KypoBaseComponent} from 'kypo-common';
import {KypoRequestedPagination} from 'kypo-common';
import {SandboxPoolDetailControls} from './sandbox-pool-detail-controls';
import {KypoControlItem} from 'kypo-controls';
import {SandboxInstanceService} from '../../../services/sandbox-instance/sandbox-instance.service';
import {PoolAllocationRequestsPollingService} from '../../../services/pool-request/allocation/pool-allocation-requests-polling.service';
import {PoolCleanupRequestsPollingService} from '../../../services/pool-request/cleanup/pool-cleanup-requests-polling.service';
import {SandboxInstanceTable} from '../../../model/tables/sandbox-instance-table';
import {AllocationRequestTable} from '../../../model/tables/allocation-request-table';
import {CleanupRequestTable} from '../../../model/tables/cleanup-request-table';
import {SandboxNavigator} from '../../../services/client/sandbox-navigator.service';
import {SandboxAgendaContext} from '../../../services/internal/sandox-agenda-context.service';
import {POOL_DATA_ATTRIBUTE_NAME} from '../../../model/client/activated-route-data-attributes';

/**
 * Smart component of sandbox pool detail page
 */
@Component({
  selector: 'kypo-sandbox-instance-overview',
  templateUrl: './sandbox-pool-detail.component.html',
  styleUrls: ['./sandbox-pool-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPoolDetailComponent extends KypoBaseComponent implements OnInit {

  pool: Pool;

  instances$: Observable<Kypo2Table<SandboxInstance>>;
  instancesTableHasError$: Observable<boolean>;

  allocationRequests$: Observable<Kypo2Table<Request>>;
  allocationRequestsTableHasError$: Observable<boolean>;

  cleanupRequests$: Observable<Kypo2Table<Request>>;
  cleanupRequestsTableHasError$: Observable<boolean>;

  controls: KypoControlItem[];

  constructor(private instanceService: SandboxInstanceService,
              private allocationRequestService: PoolAllocationRequestsPollingService,
              private cleanupRequestService: PoolCleanupRequestsPollingService,
              private navigator: SandboxNavigator,
              private context: SandboxAgendaContext,
              private activeRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.initTables();
    this.initControls();
  }

  /**
   * Gets new data for sandbox instance overview table
   * @param loadEvent load event emitted from sandbox instances table
   */
  onInstanceLoadEvent(loadEvent: LoadTableEvent) {
    this.instanceService.getAll(this.pool.id, loadEvent.pagination)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Gets new data for creation requests overview table
   * @param loadEvent load event emitted from creation requests table
   */
  onAllocationRequestsLoadEvent(loadEvent: LoadTableEvent) {
    this.allocationRequestService.getAll(this.pool.id, loadEvent.pagination)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Gets new data for cleanup requests overview table
   * @param loadEvent load event emitted from cleanup requests table
   */
  onCleanupRequestsLoadEvent(loadEvent: LoadTableEvent) {
    this.cleanupRequestService.getAll(this.pool.id, loadEvent.pagination)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  onControlsAction(control: KypoControlItem) {
    control.result$
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe();
  }

  /**
   * Subscribes to result of a table action event
   * @param event action event emitted from table component
   */
  onTableAction(event: TableActionEvent<any>) {
    event.action.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  private initTables() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new KypoRequestedPagination(0, this.context.config.defaultPaginationSize, '', ''));
    this.activeRoute.data
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(data => {
        this.pool = data[POOL_DATA_ATTRIBUTE_NAME];
        this.onInstanceLoadEvent(initialLoadEvent);
        this.onAllocationRequestsLoadEvent(initialLoadEvent);
        this.onCleanupRequestsLoadEvent(initialLoadEvent);
      }
    );

    this.instances$ = this.instanceService.resource$
      .pipe(
        map(resource => new SandboxInstanceTable(resource, this.pool.id, this.instanceService))
      );
    this.instancesTableHasError$ = this.instanceService.hasError$;

    this.allocationRequests$ = this.allocationRequestService.resource$
      .pipe(
        map(resource => new AllocationRequestTable(resource, this.pool.id, this.allocationRequestService, this.navigator)));
    this.allocationRequestsTableHasError$ = this.allocationRequestService.hasError$;

    this.cleanupRequests$ = this.cleanupRequestService.resource$
      .pipe(
        map(resource => new CleanupRequestTable(resource, this.pool.id, this.navigator))
      );
    this.cleanupRequestsTableHasError$ = this.cleanupRequestService.hasError$;
  }

  private initControls() {
    this.controls = SandboxPoolDetailControls.create(this.pool, this.instanceService);
  }
}
