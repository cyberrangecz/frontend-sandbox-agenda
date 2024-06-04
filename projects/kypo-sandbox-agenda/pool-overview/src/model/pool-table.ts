import { PaginatedResource } from '@sentinel/common/pagination';
import { Pool, Resources } from '@muni-kypo-crp/sandbox-model';
import {
  Column,
  Row,
  RowAction,
  DeleteAction,
  EditAction,
  ExpandableSentinelTable,
  RowExpand,
} from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { PoolRowAdapter } from './pool-row-adapter';
import { AbstractPoolService } from '../services/abstract-pool/abstract-sandbox/abstract-pool.service';
import { SandboxInstanceService } from '@muni-kypo-crp/sandbox-agenda/pool-detail';
import { PoolExpandDetailComponent } from '../components/pool-expand-detail/pool-expand-detail.component';

/**
 * Helper class transforming paginated resource to class for common table component
 * @dynamic
 */
export class PoolTable extends ExpandableSentinelTable<PoolRowAdapter, PoolExpandDetailComponent, null> {
  resources$: Observable<Resources>;
  constructor(
    resource: PaginatedResource<Pool>,
    abstractPoolService: AbstractPoolService,
    sandboxInstanceService: SandboxInstanceService,
    navigator: SandboxNavigator
  ) {
    const rows = resource.elements.map((element) =>
      PoolTable.createRow(element, abstractPoolService, sandboxInstanceService, navigator)
    );
    const columns = [
      new Column('title', 'Title', true, 'id'),
      new Column('createdByName', 'Created by', true, 'created_by__username'),
      new Column('sandboxDefinitionNameAndRevision', 'Sandbox definition', true, 'definition__name'),
      new Column('comment', 'Notes and comments', false),
      new Column('lockState', 'State', true, 'lock'),
      new Column('usedAndMaxSize', 'Size', true, 'max_size'),
      new Column('instancesUtilization', 'Instances util.', false),
      new Column('cpuUtilization', 'CPU util.', false),
      new Column('ramUtilization', 'RAM util.', false),
    ];
    const expand = new RowExpand(PoolExpandDetailComponent, null);
    super(rows, columns, expand);
    this.pagination = resource.pagination;
  }

  private static createRow(
    pool: Pool,
    abstractPoolService: AbstractPoolService,
    sandboxInstanceService: SandboxInstanceService,
    navigator: SandboxNavigator
  ): Row<PoolRowAdapter> {
    const rowAdapter = pool as PoolRowAdapter;
    rowAdapter.title = `Pool ${rowAdapter.id}`;
    rowAdapter.createdByName = pool.createdBy.fullName;
    rowAdapter.sandboxDefinitionNameAndRevision = `${pool.definition.title} (${pool.definition.rev})`;
    rowAdapter.comment = pool.comment;
    rowAdapter.instancesUtilization = `${(pool.hardwareUsage.instances * 100).toFixed(1)}%`;
    rowAdapter.cpuUtilization = `${(pool.hardwareUsage.vcpu * 100).toFixed(1)}%`;
    rowAdapter.ramUtilization = `${(pool.hardwareUsage.ram * 100).toFixed(1)}%`;
    rowAdapter.portsUtilization = `${(pool.hardwareUsage.port * 100).toFixed(1)}%`;
    rowAdapter.networksUtilization = `${(pool.hardwareUsage.network * 100).toFixed(1)}%`;

    const row = new Row(rowAdapter, this.createActions(pool, abstractPoolService, sandboxInstanceService));
    row.addLink('title', navigator.toPool(rowAdapter.id));
    return row;
  }

  private static createActions(
    pool: Pool,
    abstractPoolService: AbstractPoolService,
    sandboxInstanceService: SandboxInstanceService
  ): RowAction[] {
    return [
      new EditAction(
        'Edit Pool',
        of(false),
        defer(() => abstractPoolService.updatePool(pool))
      ),
      new RowAction(
        'allocate_all',
        'Allocate All',
        'subscriptions',
        'primary',
        this.createAllocationTooltip(pool.maxSize, pool.usedSize),
        of(pool.isFull()),
        defer(() => sandboxInstanceService.allocateSpecified(pool.id, pool.maxSize - pool.usedSize))
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
      new DeleteAction(
        'Delete Pool',
        of(false),
        defer(() => abstractPoolService.delete(pool))
      ),
      new RowAction(
        'download_man_ssh_configs',
        'Get management SSH Configs',
        'vpn_key',
        'primary',
        '',
        of(false),
        defer(() => abstractPoolService.getSshAccess(pool.id))
      ),
      this.createLockAction(pool, abstractPoolService),
    ];
  }

  private static createAllocationTooltip(maxSandboxSize: number, usedSandboxSize: number): string {
    if (maxSandboxSize - usedSandboxSize == 1) {
      if (maxSandboxSize == 1) return 'Allocate sandbox immediately';
      else return 'Allocate the last sandbox';
    } else return 'Allocate a specific number of sandboxes';
  }

  private static createLockAction(pool: Pool, service: AbstractPoolService): RowAction {
    if (pool.isLocked()) {
      return new RowAction(
        'unlock',
        'Unlock pool',
        'lock_open',
        'primary',
        '',
        of(false),
        defer(() => service.unlock(pool))
      );
    } else {
      return new RowAction(
        'lock',
        'Lock pool',
        'lock',
        'primary',
        '',
        of(false),
        defer(() => service.lock(pool))
      );
    }
  }
}
