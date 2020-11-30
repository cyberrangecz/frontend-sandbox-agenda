import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from 'kypo-sandbox-model';
import { SandboxInstance } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { SandboxInstanceTable } from '../model/sandbox-instance-table';
import { SandboxNavigator, POOL_DATA_ATTRIBUTE_NAME } from '@kypo/sandbox-agenda';
import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { AllocationRequestsService } from '../services/state/request/allocation/requests/allocation-requests.service';
import { CleanupRequestsService } from '../services/state/request/cleanup/cleanup-requests.service';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';
import { PoolDetailControls } from './pool-detail-controls';
import { AllocationRequestTable } from '../model/allocation-request-table';
import { CleanupRequestTable } from '../model/cleanup-request-table';
import { SandboxAllocationUnitsService } from '../services/state/request/allocation/units/sandbox-allocation-units.service';
import { SandboxAllocationUnitTable } from '../model/sandbox-allocation-unit-table';
import { AllocationRequestsConcreteService } from '../services/state/request/allocation/requests/allocation-requests-concrete.service';
import { SandboxAllocationUnitsConcreteService } from '../services/state/request/allocation/units/sandbox-allocation-units-concrete.service';
import { CleanupRequestsConcreteService } from '../services/state/request/cleanup/cleanup-requests-concrete.service';
import { SandboxInstanceConcreteService } from '../services/state/sandbox-instance/sandbox-instance-concrete.service';

/**
 * Smart component of pool detail page
 */
@Component({
  selector: 'kypo-pool-detail',
  templateUrl: './pool-detail.component.html',
  styleUrls: ['./pool-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: AllocationRequestsService, useClass: AllocationRequestsConcreteService },
    { provide: SandboxAllocationUnitsService, useClass: SandboxAllocationUnitsConcreteService },
    { provide: CleanupRequestsService, useClass: CleanupRequestsConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
  ],
})
export class PoolDetailComponent extends SentinelBaseDirective implements OnInit {
  pool: Pool;

  instances$: Observable<SentinelTable<SandboxInstance>>;
  instancesTableHasError$: Observable<boolean>;

  allocationUnits$: Observable<SandboxAllocationUnitTable>;
  allocationUnitsTableHasError$: Observable<boolean>;

  allocationRequests$: Observable<SentinelTable<Request>>;
  allocationRequestsTableHasError$: Observable<boolean>;

  cleanupRequests$: Observable<SentinelTable<Request>>;
  cleanupRequestsTableHasError$: Observable<boolean>;

  controls: SentinelControlItem[];

  constructor(
    private instanceService: SandboxInstanceService,
    private allocationUnitService: SandboxAllocationUnitsService,
    private allocationRequestService: AllocationRequestsService,
    private cleanupRequestService: CleanupRequestsService,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private activeRoute: ActivatedRoute
  ) {
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
    this.instanceService
      .getAll(this.pool.id, loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Gets new data for allocation units overview table
   * @param loadEvent load event emitted from allocation units table
   */
  onAllocationUnitsLoadEvent(loadEvent: LoadTableEvent) {
    this.allocationUnitService
      .getAll(this.pool.id, loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Gets new data for creation requests overview table
   * @param loadEvent load event emitted from creation requests table
   */
  onAllocationRequestsLoadEvent(loadEvent: LoadTableEvent) {
    this.allocationRequestService
      .getAll(this.pool.id, loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Gets new data for cleanup requests overview table
   * @param loadEvent load event emitted from cleanup requests table
   */
  onCleanupRequestsLoadEvent(loadEvent: LoadTableEvent) {
    this.cleanupRequestService
      .getAll(this.pool.id, loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  onControlsAction(control: SentinelControlItem) {
    control.result$.pipe(takeWhile((_) => this.isAlive)).subscribe();
  }

  /**
   * Subscribes to result of a table action event
   * @param event action event emitted from table component
   */
  onTableAction(event: TableActionEvent<any>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  private initTables() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.context.config.defaultPaginationSize, '', '')
    );
    this.activeRoute.data.pipe(takeWhile((_) => this.isAlive)).subscribe((data) => {
      this.pool = data[POOL_DATA_ATTRIBUTE_NAME];
      this.onInstanceLoadEvent(initialLoadEvent);
      this.onAllocationUnitsLoadEvent(initialLoadEvent);
      this.onAllocationRequestsLoadEvent(initialLoadEvent);
      this.onCleanupRequestsLoadEvent(initialLoadEvent);
    });

    this.instances$ = this.instanceService.resource$.pipe(
      map((resource) => new SandboxInstanceTable(resource, this.pool.id, this.instanceService))
    );
    this.instancesTableHasError$ = this.instanceService.hasError$;

    this.allocationUnits$ = this.allocationUnitService.units$.pipe(
      map((resource) => new SandboxAllocationUnitTable(resource, this.pool.id, this.allocationUnitService))
    );
    this.allocationUnitsTableHasError$ = this.allocationUnitService.hasError$;

    this.allocationRequests$ = this.allocationRequestService.resource$.pipe(
      map(
        (resource) => new AllocationRequestTable(resource, this.pool.id, this.allocationRequestService, this.navigator)
      )
    );
    this.allocationRequestsTableHasError$ = this.allocationRequestService.hasError$;

    this.cleanupRequests$ = this.cleanupRequestService.resource$.pipe(
      map((resource) => new CleanupRequestTable(resource, this.pool.id, this.cleanupRequestService, this.navigator))
    );
    this.cleanupRequestsTableHasError$ = this.cleanupRequestService.hasError$;
  }

  private initControls() {
    this.controls = PoolDetailControls.create(this.pool, this.instanceService);
  }
}
