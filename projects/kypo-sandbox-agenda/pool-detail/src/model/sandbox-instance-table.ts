import { PaginatedResource } from '@sentinel/common';
import { SandboxInstance } from '@kypo/sandbox-model';
import { Column, SentinelTable, Row, RowAction, DeleteAction } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';
import { SandboxInstanceRowAdapter } from './sandbox-instance-row-adapter';

/**
 * Helper class transforming paginated resource to class for common table component
 * @dynamic
 */
export class SandboxInstanceTable extends SentinelTable<SandboxInstanceRowAdapter> {
  constructor(resource: PaginatedResource<SandboxInstance>, poolId: number, service: SandboxInstanceService) {
    const columns = [
      new Column('id', 'id', false),
      new Column('title', 'title', false),
      new Column('lockState', 'state', false),
    ];
    const rows = resource.elements.map((element) => SandboxInstanceTable.createRow(element, poolId, service));
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    instance: SandboxInstance,
    poolId: number,
    service: SandboxInstanceService
  ): Row<SandboxInstanceRowAdapter> {
    const rowAdapter = instance as SandboxInstanceRowAdapter;
    rowAdapter.title = `Sandbox ${rowAdapter.id}`;
    return new Row(rowAdapter, this.createActions(rowAdapter, poolId, service));
  }

  private static createActions(
    instance: SandboxInstance,
    poolId: number,
    service: SandboxInstanceService
  ): RowAction[] {
    return [
      new DeleteAction(
        'Delete sandbox instance',
        of(false),
        defer(() => service.delete(instance))
      ),
      new RowAction(
        'topology',
        'Topology',
        'device_hub',
        'primary',
        'Display topology',
        of(false),
        defer(() => service.showTopology(poolId, instance))
      ),
      this.createLockAction(instance, service),
    ];
  }

  private static createLockAction(instance: SandboxInstance, service: SandboxInstanceService): RowAction {
    if (instance.isLocked()) {
      return new RowAction(
        'unlock',
        'Unlock',
        'lock_open',
        'primary',
        'Unlock sandbox instance',
        of(false),
        defer(() => service.unlock(instance))
      );
    } else {
      return new RowAction(
        'lock',
        'Lock',
        'lock',
        'primary',
        'Lock sandbox instance',
        of(false),
        defer(() => service.lock(instance))
      );
    }
  }
}
