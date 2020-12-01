import { Component, OnInit } from '@angular/core';
import { SentinelBaseDirective, RequestedPagination } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { SandboxDefinition } from '@kypo/sandbox-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { SandboxDefinitionTable } from '../model/sandbox-definition-table';
import { SandboxAgendaContext, SandboxDefinitionOverviewService } from '@kypo/sandbox-agenda/internal';
import { SandboxDefinitionOverviewControls } from './sandbox-definition-overview-controls';

@Component({
  selector: 'kypo-sandbox-definition-overview',
  templateUrl: './sandbox-definition-overview.component.html',
  styleUrls: ['./sandbox-definition-overview.component.scss'],
})

/**
 * Component displaying overview of sandbox definitions. Contains button for create sandbox definitions,
 * table with all sandbox definitions and possible actions on sandbox definition.
 */
export class SandboxDefinitionOverviewComponent extends SentinelBaseDirective implements OnInit {
  controls: SentinelControlItem[];
  sandboxDefinitions$: Observable<SentinelTable<SandboxDefinition>>;
  hasError$: Observable<boolean>;

  private lastLoadEvent: LoadTableEvent;

  constructor(
    private sandboxDefinitionService: SandboxDefinitionOverviewService,
    private context: SandboxAgendaContext
  ) {
    super();
  }

  ngOnInit() {
    this.controls = SandboxDefinitionOverviewControls.create(this.sandboxDefinitionService);
    this.initTable();
  }

  /**
   * Refreshes table with new data
   * @param event to load data
   */
  onLoadEvent(event: LoadTableEvent) {
    this.sandboxDefinitionService
      .getAll(event.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves correct action based on received event and performs it
   * @param event table action event emitted by child table component
   */
  onTableAction(event: TableActionEvent<SandboxDefinition>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  /**
   * Navigates to create sandbox definition page
   */
  onControlsActions(control: SentinelControlItem) {
    control.result$.pipe(take(1)).subscribe();
  }

  private initTable() {
    this.sandboxDefinitions$ = this.sandboxDefinitionService.resource$.pipe(
      map((resource) => new SandboxDefinitionTable(resource, this.sandboxDefinitionService))
    );
    this.lastLoadEvent = new LoadTableEvent(
      new RequestedPagination(0, this.context.config.defaultPaginationSize, '', ''),
      null
    );
    this.onLoadEvent(this.lastLoadEvent);
    this.hasError$ = this.sandboxDefinitionService.hasError$;
  }
}
