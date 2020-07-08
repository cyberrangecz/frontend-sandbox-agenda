import { Request } from 'kypo-sandbox-model';
import { RequestsService } from '../../services/request/requests.service';
import { SandboxNavigator } from '../../services/client/sandbox-navigator.service';
import { Column, DeleteAction, SentinelTable, Row, RowAction } from '@sentinel/components/table';
import { RequestRowAdapter } from './adapters/request-row-adapter';
import { PaginatedResource } from '@sentinel/common';
import { defer, of } from 'rxjs';

/**
 * @dynamic
 */
export class AllocationRequestTable extends SentinelTable<RequestRowAdapter> {
  constructor(
    resource: PaginatedResource<Request>,
    poolId: number,
    service: RequestsService,
    navigator: SandboxNavigator
  ) {
    const columns = [
      new Column('id', 'id', false),
      new Column('title', 'title', false),
      new Column('createdAtFormatted', 'created', false),
    ];
    const rows = resource.elements.map((element) =>
      AllocationRequestTable.createRow(element, poolId, service, navigator)
    );
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    request: Request,
    poolId: number,
    service: RequestsService,
    navigator: SandboxNavigator
  ): Row<RequestRowAdapter> {
    const rowAdapter = request as RequestRowAdapter;
    rowAdapter.title = `Request ${rowAdapter.id}`;
    const row = new Row(rowAdapter, this.createActions(request, service));
    row.addLink('title', navigator.toAllocationRequest(poolId, rowAdapter.id));
    return row;
  }

  private static createActions(request: Request, service: RequestsService): RowAction[] {
    return [
      new RowAction(
        'cancel',
        'Cancel',
        'cancel',
        'warn',
        'Cancel request',
        of(false),
        defer(() => service.cancel(request))
      ),
      new DeleteAction(
        'Delete request',
        of(false),
        defer(() => service.delete(request))
      ),
    ];
  }
}
