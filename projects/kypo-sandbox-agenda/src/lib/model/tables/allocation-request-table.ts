import { KypoPaginatedResource } from 'kypo-common';
import { AllocationRequest } from 'kypo-sandbox-model';
import { Column, DeleteAction, Kypo2Table, Row, RowAction } from 'kypo2-table';
import { defer, of } from 'rxjs';
import { SandboxNavigator } from '../../services/client/sandbox-navigator.service';
import { PoolAllocationRequestsService } from '../../services/pool-request/allocation/pool-allocation-requests.service';

/**
 * @dynamic
 */
export class AllocationRequestTable extends Kypo2Table<AllocationRequest> {
  constructor(
    resource: KypoPaginatedResource<AllocationRequest>,
    poolId: number,
    service: PoolAllocationRequestsService,
    navigator: SandboxNavigator
  ) {
    const columns = [new Column('id', 'id', false), new Column('createdAtFormatted', 'created', false)];
    const rows = resource.elements.map((element) =>
      AllocationRequestTable.createRow(element, poolId, service, navigator)
    );
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    request: AllocationRequest,
    poolId: number,
    service: PoolAllocationRequestsService,
    navigator: SandboxNavigator
  ): Row<AllocationRequest> {
    const row = new Row(request, this.createActions(request, service));
    row.addLink('id', navigator.toAllocationRequest(poolId, request.allocationUnitId, request.id));
    return row;
  }

  private static createActions(request: AllocationRequest, service: PoolAllocationRequestsService): RowAction[] {
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
