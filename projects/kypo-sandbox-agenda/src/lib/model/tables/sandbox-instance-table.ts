import {SandboxInstance} from 'kypo-sandbox-model';
import {Column, Kypo2Table, Row, RowAction} from 'kypo2-table';
import {defer, of} from 'rxjs';
import {KypoPaginatedResource} from 'kypo-common';
import {DeleteAction} from 'kypo2-table';
import {SandboxInstanceService} from '../../services/sandbox-instance/sandbox-instance.service';

/**
 * Helper class transforming paginated resource to class for common table component
 * @dynamic
 */
export class SandboxInstanceTable extends Kypo2Table<SandboxInstance> {

  constructor(resource: KypoPaginatedResource<SandboxInstance>, poolId: number, service: SandboxInstanceService) {
    const columns = [
      new Column('id', 'id', false),
      new Column('lockState', 'state', false),
    ];
    const rows = resource.elements.map(element => SandboxInstanceTable.createRow(element, poolId, service));
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(instance: SandboxInstance, poolId: number, service: SandboxInstanceService): Row<SandboxInstance> {
    const row = new Row(instance, this.createActions(instance, poolId, service));
    // TODO: ADD when supported by API
    //  row.addLink('id', RouteFactory.toSandboxInstance(poolId, instance.id));
    return row;
  }

  private static createActions(instance: SandboxInstance, poolId: number, service: SandboxInstanceService): RowAction[] {
    return [
      new DeleteAction(
        'Delete sandbox instance',
        of(false),
        defer(() => service.delete(instance))
      ),
      new RowAction('topology',
        'Topology',
        'device_hub',
        'primary',
        'Display topology',
        of(false),
        defer(() => service.showTopology(poolId, instance))
      ),
      this.createLockAction(instance, service)
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
        defer(() => service.unlock(instance)));
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
