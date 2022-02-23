import { PaginatedResource } from '@sentinel/common';
import { HardwareUsage, Pool, SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Column, SentinelTable, Row, RowAction, DeleteAction } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { PoolRowAdapter } from './pool-row-adapter';
import { AbstractPoolService } from '../services/abstract-pool/abstract-sandbox/abstract-pool.service';

/**
 * Helper class transforming paginated resource to class for common table component
 * @dynamic
 */
export class PoolTable extends SentinelTable<PoolRowAdapter> {
  constructor(
    resource: PaginatedResource<Pool>,
    sandboxLimits: HardwareUsage,
    sandboxDefinitions: SandboxDefinition[],
    abstractPoolService: AbstractPoolService,
    navigator: SandboxNavigator
  ) {
    const rows = resource.elements.map((element) =>
      PoolTable.createRow(element, sandboxLimits, sandboxDefinitions, abstractPoolService, navigator)
    );
    const columns = [
      new Column('title', 'title', false),
      new Column('createdByName', 'created by', false),
      new Column('sandboxDefinitionName', 'sandbox definition', false),
      new Column('lockState', 'state', false),
      new Column('usedAndMaxSize', 'size', false),
      new Column('instancesUtilization', 'Instances util.', false),
      new Column('cpuUtilization', 'CPU util.', false),
      new Column('ramUtilization', 'RAM util.', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    pool: Pool,
    sandboxLimits: HardwareUsage,
    sandboxDefinitions: SandboxDefinition[],
    abstractPoolService: AbstractPoolService,
    navigator: SandboxNavigator
  ): Row<PoolRowAdapter> {
    const rowAdapter = pool as PoolRowAdapter;
    rowAdapter.title = `Pool ${rowAdapter.id}`;
    rowAdapter.createdByName = pool.createdBy.fullName;
    rowAdapter.sandboxDefinitionName = sandboxDefinitions.find(
      (definiton) => definiton.id === pool.definitionId
    )?.title;
    rowAdapter.instancesUtilization = `${(
      ((pool.hardwareUsage.instances * pool.usedSize) / sandboxLimits.instances) *
      100
    ).toFixed(1)}%`;

    rowAdapter.cpuUtilization = `${(((pool.hardwareUsage.vcpu * pool.usedSize) / sandboxLimits.vcpu) * 100).toFixed(
      1
    )}%`;

    rowAdapter.ramUtilization = `${(((pool.hardwareUsage.ram * pool.usedSize) / sandboxLimits.ram) * 100).toFixed(1)}%`;

    const row = new Row(rowAdapter, this.createActions(pool, abstractPoolService));
    row.addLink('title', navigator.toPool(rowAdapter.id));
    return row;
  }

  private static createActions(pool: Pool, abstractPoolService: AbstractPoolService): RowAction[] {
    return [
      new DeleteAction(
        'Delete Pool',
        of(pool.usedSize !== 0),
        defer(() => abstractPoolService.delete(pool))
      ),
      new RowAction(
        'allocate_all',
        'Allocate All',
        'subscriptions',
        'primary',
        'Allocate sandboxes',
        of(pool.isFull()),
        defer(() => abstractPoolService.allocate(pool))
      ),
      new RowAction(
        'allocate_one',
        'Allocate One',
        'exposure_plus_1',
        'primary',
        'Allocate one sandbox',
        of(pool.isFull()),
        defer(() => abstractPoolService.allocate(pool, 1))
      ),
      new RowAction(
        'clear',
        'Clear',
        'clear_all',
        'warn',
        'Remove all allocations',
        of(false),
        defer(() => abstractPoolService.clear(pool))
      ),
      new RowAction(
        'download_man_ssh_configs',
        'Get SSH Configs',
        'vpn_key',
        'primary',
        'Download management SSH configs',
        of(false),
        defer(() => abstractPoolService.getSshAccess(pool.id))
      ),
      this.createLockAction(pool, abstractPoolService),
    ];
  }

  private static createLockAction(pool: Pool, service: AbstractPoolService): RowAction {
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
