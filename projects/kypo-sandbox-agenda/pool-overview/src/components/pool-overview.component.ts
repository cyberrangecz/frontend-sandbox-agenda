import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool, Resources } from '@muni-kypo-crp/sandbox-model';
import { SentinelTable, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { PoolTable } from '../model/pool-table';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { PaginationService } from '@muni-kypo-crp/sandbox-agenda/internal';
import { AbstractPoolService } from '../services/abstract-pool/abstract-sandbox/abstract-pool.service';
import { SandboxInstanceService } from '@muni-kypo-crp/sandbox-agenda/pool-detail';
import { SandboxResourcesService } from '@muni-kypo-crp/sandbox-agenda/sandbox-resources';

/**
 * Smart component of sandbox pool overview page
 */
@Component({
  selector: 'kypo-sandbox-pool-overview',
  templateUrl: './pool-overview.component.html',
  styleUrls: ['./pool-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoolOverviewComponent extends SentinelBaseDirective implements OnInit {
  pools$: Observable<SentinelTable<Pool>>;
  hasError$: Observable<boolean>;
  resources$: Observable<Resources>;
  controls: SentinelControlItem[] = [];

  constructor(
    private sandboxResourcesService: SandboxResourcesService,
    private abstractPoolService: AbstractPoolService,
    private sandboxInstanceService: SandboxInstanceService,
    private navigator: SandboxNavigator,
    private paginationService: PaginationService
  ) {
    super();
    this.resources$ = this.sandboxResourcesService.resources$;
  }

  ngOnInit(): void {
    this.initTable();
    this.initControls();
    this.initResources();
  }

  /**
   * Gets new data for pool overview table
   * @param loadEvent load data event from table component
   */
  onLoadEvent(loadEvent: TableLoadEvent): void {
    this.paginationService.setPagination(loadEvent.pagination.size);
    this.abstractPoolService
      .getAll(loadEvent.pagination)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action event emitted from pool overview table
   */
  onPoolAction(event: TableActionEvent<Pool>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  onControls(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  private initTable() {
    const initialLoadEvent: TableLoadEvent = {
      pagination: new OffsetPaginationEvent(0, this.paginationService.getPagination(), '', 'asc'),
    };
    this.pools$ = this.abstractPoolService.pools$.pipe(
      map(
        (resource) =>
          new PoolTable(
            resource,
            this.resources$,
            this.abstractPoolService,
            this.sandboxInstanceService,
            this.navigator
          )
      )
    );
    this.hasError$ = this.abstractPoolService.poolsHasError$;
    this.onLoadEvent(initialLoadEvent);
  }

  private initControls() {
    this.controls = [
      new SentinelControlItem(
        'create',
        'Create',
        'primary',
        of(false),
        defer(() => this.abstractPoolService.create())
      ),
    ];
  }

  private initResources() {
    this.sandboxResourcesService
      .getResources()
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }
}
