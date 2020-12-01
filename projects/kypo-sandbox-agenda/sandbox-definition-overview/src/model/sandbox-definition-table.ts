import { PaginatedResource } from '@sentinel/common';
import { SandboxDefinition } from '@kypo/sandbox-model';
import { Column, SentinelTable, Row, RowExpand, DeleteAction } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { SandboxDefinitionDetailComponent } from '../components/sandbox-definition-detail/sandbox-definition-detail.component';
import { SandboxDefinitionOverviewService } from '@kypo/sandbox-agenda/internal';

/**
 * Helper class transforming paginated resource to class for common table component
 */
export class SandboxDefinitionTable extends SentinelTable<SandboxDefinition> {
  constructor(resource: PaginatedResource<SandboxDefinition>, service: SandboxDefinitionOverviewService) {
    const columns = [new Column('id', 'id', false), new Column('title', 'title', false)];
    const rows = resource.elements.map((element) => SandboxDefinitionTable.createRow(element, service));
    super(rows, columns);
    this.expand = new RowExpand(SandboxDefinitionDetailComponent);
    this.pagination = resource.pagination;
    this.filterable = false;
    this.selectable = false;
  }

  private static createRow(
    sandboxDefinition: SandboxDefinition,
    service: SandboxDefinitionOverviewService
  ): Row<SandboxDefinition> {
    const actions = [
      new DeleteAction(
        'Delete sandbox definition',
        of(false),
        defer(() => service.delete(sandboxDefinition))
      ),
    ];
    return new Row(sandboxDefinition, actions);
  }
}
