import { KypoPaginatedResource } from 'kypo-common';
import { CleanupRequest } from 'kypo-sandbox-model';
import { Column, Kypo2Table, Row } from 'kypo2-table';
import { SandboxNavigator } from '../../services/client/sandbox-navigator.service';
import { CleanupRequestRowAdapter } from './adapters/cleanup-request-row-adapter';

export class CleanupRequestTable extends Kypo2Table<CleanupRequestRowAdapter> {
  constructor(resource: KypoPaginatedResource<CleanupRequest>, poolId: number, navigator: SandboxNavigator) {
    const columns = [
      new Column('id', 'id', false),
      new Column('title', 'title', false),
      new Column('createdAtFormatted', 'created', false),
    ];
    const rows = resource.elements.map((element) => CleanupRequestTable.createRow(element, poolId, navigator));
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    request: CleanupRequest,
    poolId: number,
    navigator: SandboxNavigator
  ): Row<CleanupRequestRowAdapter> {
    const rowAdapter = request as CleanupRequestRowAdapter;
    rowAdapter.title = `Request ${rowAdapter.id}`;
    const row = new Row(rowAdapter);
    row.addLink('title', navigator.toCleanupRequest(poolId, rowAdapter.allocationUnitId, rowAdapter.id));
    return row;
  }
}
