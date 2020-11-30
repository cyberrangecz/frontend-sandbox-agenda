import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from 'kypo-sandbox-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { PoolTable } from '../model/pool-table';
import { SandboxNavigator } from '@kypo/sandbox-agenda';
import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { PoolOverviewService } from '../services/state/pool-overview.service';

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
    private service: PoolOverviewService,
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
    this.service
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
    this.pools$ = this.service.resource$.pipe(map((resource) => new PoolTable(resource, this.service, this.navigator)));
    this.hasError$ = this.service.hasError$;
    this.onPoolsLoadEvent(initialLoadEvent);
  }

  private initControls() {
    this.controls = [
      new SentinelControlItem(
        'create',
        'Create',
        'primary',
        of(false),
        defer(() => this.service.create())
      ),
    ];
  }
}
