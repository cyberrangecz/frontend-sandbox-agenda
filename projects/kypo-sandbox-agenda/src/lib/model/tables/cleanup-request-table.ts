import {KypoPaginatedResource} from 'kypo-common';
import {Column, Kypo2Table, Row} from 'kypo2-table';
import {CleanupRequest} from 'kypo-sandbox-model';
import {SandboxNavigator} from '../../services/client/sandbox-navigator.service';

export class CleanupRequestTable extends Kypo2Table<CleanupRequest> {
  constructor(resource: KypoPaginatedResource<CleanupRequest>, poolId: number, navigator: SandboxNavigator) {
    const columns = [
      new Column('id', 'id', false),
      new Column('createdAtFormatted', 'created', false),
    ];
    const rows = resource.elements.map(element => CleanupRequestTable.createRow(element, poolId, navigator));
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(request: CleanupRequest, poolId: number, navigator: SandboxNavigator): Row<CleanupRequest> {
    const row = new Row(request);
    row.addLink('id', navigator.toCleanupRequest(poolId, request.allocationUnitId, request.id));
    return row;
  }
}
