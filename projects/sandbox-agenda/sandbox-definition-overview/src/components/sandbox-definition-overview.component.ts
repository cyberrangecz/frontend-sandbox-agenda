import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { SandboxDefinition } from '@crczp/sandbox-model';
import { SentinelTable, TableActionEvent, TableLoadEvent } from '@sentinel/components/table';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SandboxDefinitionTable } from '../model/sandbox-definition-table';
import { PaginationService, SandboxDefinitionOverviewService } from '@crczp/sandbox-agenda/internal';
import { SandboxDefinitionOverviewControls } from './sandbox-definition-overview-controls';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'crczp-sandbox-definition-overview',
    templateUrl: './sandbox-definition-overview.component.html',
    styleUrls: ['./sandbox-definition-overview.component.scss'],
})

/**
 * Component displaying overview of sandbox definitions. Contains button for create sandbox definitions,
 * table with all sandbox definitions and possible actions on sandbox definition.
 */
export class SandboxDefinitionOverviewComponent implements OnInit {
    @Input() paginationId = 'crczp-sandbox-definition-overview';
    controls: SentinelControlItem[];
    sandboxDefinitions$: Observable<SentinelTable<SandboxDefinition>>;
    hasError$: Observable<boolean>;
    destroyRef = inject(DestroyRef);

    private lastLoadEvent: TableLoadEvent;

    constructor(
        private sandboxDefinitionService: SandboxDefinitionOverviewService,
        private paginationService: PaginationService,
    ) {}

    ngOnInit(): void {
        this.controls = SandboxDefinitionOverviewControls.create(this.sandboxDefinitionService);
        this.initTable();
    }

    /**
     * Refreshes table with new data
     * @param event to load data
     */
    onLoadEvent(event: TableLoadEvent): void {
        this.paginationService.setPagination(this.paginationId, event.pagination.size);
        this.sandboxDefinitionService.getAll(event.pagination).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    /**
     * Resolves correct action based on received event and performs it
     * @param event table action event emitted by child table component
     */
    onTableAction(event: TableActionEvent<SandboxDefinition>): void {
        event.action.result$.pipe(take(1)).subscribe();
    }

    /**
     * Navigates to create sandbox definition page
     */
    onControlsActions(control: SentinelControlItem): void {
        control.result$.pipe(take(1)).subscribe();
    }

    private initTable() {
        this.sandboxDefinitions$ = this.sandboxDefinitionService.resource$.pipe(
            map((resource) => new SandboxDefinitionTable(resource, this.sandboxDefinitionService)),
        );
        this.lastLoadEvent = {
            pagination: new OffsetPaginationEvent(
                0,
                this.paginationService.getPagination(this.paginationId),
                '',
                'asc',
            ),
        };
        this.onLoadEvent(this.lastLoadEvent);
        this.hasError$ = this.sandboxDefinitionService.hasError$;
    }
}
