import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from 'kypo-sandbox-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { PoolTable } from '../../../model/tables/pool-table';
import { SandboxNavigator } from '../../../services/client/sandbox-navigator.service';
import { SandboxAgendaContext } from '../../../services/internal/sandox-agenda-context.service';
import { PoolOverviewService } from '../../../services/pool/pool-overview.service';

/**
 * Smart component of sandbox pool overview page
 */
@Component({
  selector: 'kypo-sandbox-pool-overview',
  templateUrl: './sandbox-pool-overview.component.html',
  styleUrls: ['./sandbox-pool-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPoolOverviewComponent extends SentinelBaseDirective implements OnInit {
  pools$: Observable<SentinelTable<Pool>>;
  hasError$: Observable<boolean>;

  controls: SentinelControlItem[] = [];

  constructor(
    private poolService: PoolOverviewService,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext
  ) {
    super();
  }

  ngOnInit() {
    this.initTable();
    this.initControls();
  }

  /**
   * Gets new data for pool overview table
   * @param loadEvent load data event from table component
   */
  onPoolsLoadEvent(loadEvent: LoadTableEvent) {
    this.poolService
      .getAll(loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action event emitted from pool overview table
   */
  onPoolAction(event: TableActionEvent<Pool>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  onControls(controlItem: SentinelControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.context.config.defaultPaginationSize, '', '')
    );
    this.pools$ = this.poolService.resource$.pipe(
      map((resource) => new PoolTable(resource, this.poolService, this.navigator))
    );
    this.hasError$ = this.poolService.hasError$;
    this.onPoolsLoadEvent(initialLoadEvent);
  }

  private initControls() {
    this.controls = [
      new SentinelControlItem(
        'create',
        'Create',
        'primary',
        of(false),
        defer(() => this.poolService.create())
      ),
    ];
  }
}
