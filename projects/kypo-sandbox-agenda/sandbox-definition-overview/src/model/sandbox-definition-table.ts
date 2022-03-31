import { PaginatedResource } from '@sentinel/common';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Column, SentinelTable, Row, RowExpand, DeleteAction, RowAction } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { SandboxDefinitionDetailComponent } from '../components/sandbox-definition-detail/sandbox-definition-detail.component';
import { SandboxDefinitionOverviewService } from '@muni-kypo-crp/sandbox-agenda/internal';
import { SandboxDefinitionRowAdapter } from './sandbox-definition-row-adapter';

/**
 * Helper class transforming paginated resource to class for common table component
 */
export class SandboxDefinitionTable extends SentinelTable<SandboxDefinition> {
  constructor(resource: PaginatedResource<SandboxDefinition>, service: SandboxDefinitionOverviewService) {
    const columns = [
      new Column('id', 'id', false),
      new Column('title', 'title', false),
      new Column('createdByName', 'Created by', false),
    ];
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
  ): Row<SandboxDefinitionRowAdapter> {
    const actions = [
      new RowAction(
        'topology',
        'Topology',
        'device_hub',
        'primary',
        'Display topology',
        of(false),
        defer(() => service.showTopology(sandboxDefinition))
      ),
      new DeleteAction(
        'Delete sandbox definition',
        of(false),
        defer(() => service.delete(sandboxDefinition))
      ),
    ];
    const rowAdapter = sandboxDefinition as SandboxDefinitionRowAdapter;
    rowAdapter.createdByName = sandboxDefinition.createdBy.fullName;
    const row = new Row(rowAdapter, actions);
    row.addLink('title', this.parseUrl(sandboxDefinition.url), '_blank');
    return row;
  }

  private static parseUrl(gitUrl: string): string {
    let res = gitUrl;
    res = res.replace('git@', '');
    res = res.replace(':', '/');
    res = res.replace('.git', '');
    res = 'https://' + res;
    return res;
  }
}
