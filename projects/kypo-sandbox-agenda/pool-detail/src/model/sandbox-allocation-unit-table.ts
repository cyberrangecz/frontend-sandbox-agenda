import { SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';
import { Column, Row, RowAction, SentinelTable } from '@sentinel/components/table';
import { PaginatedResource, SentinelDateTimeFormatPipe } from '@sentinel/common';
import { defer, of } from 'rxjs';
import { SandboxAllocationUnitsService } from '../services/state/request/allocation/units/sandbox-allocation-units.service';
import { SandboxAllocationUnitRowAdapter } from './sandbox-allocation-unit-row-adapter';

/**
 * @dynamic
 */
export class SandboxAllocationUnitTable extends SentinelTable<SandboxAllocationUnitRowAdapter> {
  constructor(
    resource: PaginatedResource<SandboxAllocationUnit>,
    poolId: number,
    service: SandboxAllocationUnitsService
  ) {
    const columns = [
      new Column('id', 'id', false),
      new Column('title', 'title', false),
      new Column('allocationUnitId', 'allocation request id', false),
      new Column('allocationRequestTitle', 'allocation request title', false),
    ];
    const rows = resource.elements.map((element) => SandboxAllocationUnitTable.createRow(element, service));
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    sandboxAllocationUnit: SandboxAllocationUnit,
    service: SandboxAllocationUnitsService
  ): Row<SandboxAllocationUnitRowAdapter> {
    const dateFormatter = new SentinelDateTimeFormatPipe('en-US');
    const rowAdapter: SandboxAllocationUnitRowAdapter = {
      allocationRequestTitle: `Request`,
      id: sandboxAllocationUnit.id,
      poolId: sandboxAllocationUnit.poolId,
      allocationUnitId: sandboxAllocationUnit.allocationRequest.allocationUnitId,
      allocationRequest: sandboxAllocationUnit.allocationRequest,
      title: `Sandbox Allocation Unit ${sandboxAllocationUnit.id}`,
    };
    rowAdapter.allocationRequest.createdAt = dateFormatter.transform(sandboxAllocationUnit.allocationRequest.createdAt);
    return new Row(rowAdapter, this.createActions(sandboxAllocationUnit, service));
  }

  private static createActions(
    sandboxAllocationUnit: SandboxAllocationUnit,
    service: SandboxAllocationUnitsService
  ): RowAction[] {
    return [
      new RowAction(
        'create',
        'Create',
        'cleaning_services',
        'primary',
        'Create cleanup request',
        of(false),
        defer(() => service.cleanup(sandboxAllocationUnit.allocationRequest))
      ),
    ];
  }
}
