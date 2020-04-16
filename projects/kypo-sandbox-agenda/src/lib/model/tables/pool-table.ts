import { KypoPaginatedResource } from 'kypo-common';
import { Pool } from 'kypo-sandbox-model';
import { Column, Kypo2Table, Row, RowAction } from 'kypo2-table';
import { DeleteAction } from 'kypo2-table';
import { defer, of } from 'rxjs';
import { SandboxNavigator } from '../../services/client/sandbox-navigator.service';
import { PoolOverviewService } from '../../services/pool/pool-overview.service';

/**
 * Helper class transforming paginated resource to class for common table component
 * @dynamic
 */
export class PoolTable extends Kypo2Table<Pool> {
  constructor(resource: KypoPaginatedResource<Pool>, service: PoolOverviewService, navigator: SandboxNavigator) {
    const rows = resource.elements.map((element) => PoolTable.createRow(element, service, navigator));
    const columns = [
      new Column('id', 'id', false),
      new Column('definitionId', 'definition id', false),
      new Column('lockState', 'state', false),
      new Column('usedAndMaxSize', 'size', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(pool: Pool, service: PoolOverviewService, navigator: SandboxNavigator): Row<Pool> {
    const row = new Row(pool, this.createActions(pool, service));
    row.addLink('id', navigator.toPool(pool.id));
    return row;
  }

  private static createActions(pool: Pool, service: PoolOverviewService): RowAction[] {
    return [
      new DeleteAction(
        'Delete Pool',
        of(pool.usedSize !== 0),
        defer(() => service.delete(pool))
      ),
      new RowAction(
        'allocate_all',
        'Allocate All',
        'subscriptions',
        'primary',
        'Allocate sandboxes',
        of(pool.isFull()),
        defer(() => service.allocate(pool))
      ),
      new RowAction(
        'allocate_one',
        'Allocate One',
        'exposure_plus_1',
        'primary',
        'Allocate one sandbox',
        of(pool.isFull()),
        defer(() => service.allocate(pool, 1))
      ),
      new RowAction(
        'clear',
        'Clear',
        'clear_all',
        'warn',
        'Remove all allocations',
        of(false),
        defer(() => service.clear(pool))
      ),
      this.createLockAction(pool, service),
    ];
  }

  private static createLockAction(pool: Pool, service: PoolOverviewService): RowAction {
    if (pool.isLocked()) {
      return new RowAction(
        'unlock',
        'Unlock',
        'lock_open',
        'primary',
        'Unlock pool',
        of(false),
        defer(() => service.unlock(pool))
      );
    } else {
      return new RowAction(
        'lock',
        'Lock',
        'lock',
        'primary',
        'Lock pool',
        of(false),
        defer(() => service.lock(pool))
      );
    }
  }
}
