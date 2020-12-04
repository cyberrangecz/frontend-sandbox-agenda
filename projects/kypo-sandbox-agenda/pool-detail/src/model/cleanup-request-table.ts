import { Request, SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';
import { RequestsService } from '../services/state/request/requests.service';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { Column, SentinelTable, Row, RowAction, DeleteAction } from '@sentinel/components/table';
import { RequestRowAdapter } from './request-row-adapter';
import { PaginatedResource, SentinelDateTimeFormatPipe } from '@sentinel/common';
import { defer, of } from 'rxjs';

/**
 * @dynamic
 */
export class CleanupRequestTable extends SentinelTable<RequestRowAdapter> {
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
    const rows = resource.elements.map((element) => CleanupRequestTable.createRow(element, poolId, service, navigator));
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
    const dateFormatter = new SentinelDateTimeFormatPipe('en-US');
    rowAdapter.title = `Request ${rowAdapter.id}`;
    rowAdapter.createdAtFormatted = dateFormatter.transform(rowAdapter.createdAt);
    const row = new Row(rowAdapter, this.createActions(request, service));
    row.addLink('title', navigator.toCleanupRequest(poolId, rowAdapter.id));
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
        'Delete cleanup request',
        of(false),
        defer(() => service.delete(request))
      ),
    ];
  }
}
