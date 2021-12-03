import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { combineLatest, defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { PoolTable } from '../model/pool-table';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { PaginationService } from '@muni-kypo-crp/sandbox-agenda/internal';
import { AbstractPoolService } from '../services/abstract-pool/abstract-sandbox/abstract-pool.service';

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

  controls: SentinelControlItem[] = [];

  constructor(
    private abstractPoolService: AbstractPoolService,
    private navigator: SandboxNavigator,
    private paginationService: PaginationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initTable();
    this.initControls();
  }

  /**
   * Gets new data for pool overview table
   * @param loadEvent load data event from table component
   */
  onLoadEvent(loadEvent: LoadTableEvent): void {
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
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.paginationService.getPagination(), '', '')
    );
    this.pools$ = combineLatest([this.abstractPoolService.pools$, this.abstractPoolService.limits$]).pipe(
      map((resource) => new PoolTable(resource[0], resource[1], this.abstractPoolService, this.navigator))
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
}
