import { CleanupRequest, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { Column, SentinelTable, Row, RowAction, DeleteAction } from '@sentinel/components/table';
import { PaginatedResource, SentinelDateTimeFormatPipe } from '@sentinel/common';
import { defer, of } from 'rxjs';
import { PoolDetailRowAdapter } from './pool-detail-row-adapter';
import { CleanupRequestsService } from '../services/state/request/cleanup/cleanup-requests.service';
import { AbstractSandbox } from './abstract-sandbox';
import { AbstractSandboxService } from '../services/abstract-sandbox/abstract-sandbox.service';

/**
 * @dynamic
 */
export class PoolDetailTable extends SentinelTable<PoolDetailRowAdapter> {
  constructor(
    resource: PaginatedResource<AbstractSandbox>,
    abstractSandboxService: AbstractSandboxService,
    navigator: SandboxNavigator
  ) {
    const columns = [
      new Column('name', 'name', false),
      new Column('lock', 'lock', false),
      new Column('created', 'created', false),
      new Column('createdBy', 'created by', false),
      new Column('state', 'state', false),
      new Column('stages', 'stages', false),
    ];
    const rows = resource.elements.map((element) =>
      PoolDetailTable.createRow(element, abstractSandboxService, navigator)
    );
    super(rows, columns);
    this.pagination = resource.pagination;
  }

  private static createRow(
    data: AbstractSandbox,
    abstractSandboxService: AbstractSandboxService,
    navigator: SandboxNavigator
  ): Row<PoolDetailRowAdapter> {
    const rowAdapter = new PoolDetailRowAdapter();
    const dateFormatter = new SentinelDateTimeFormatPipe('en-US');
    rowAdapter.unitId = data.allocationRequest.id;
    rowAdapter.name = data.name;
    rowAdapter.lock = this.lockResolver(data.sandboxInstance);
    rowAdapter.created = dateFormatter.transform(data.allocationRequest.createdAt);
    rowAdapter.createdBy = data.createdBy;
    rowAdapter.state = data.stateResolver();
    rowAdapter.stages = this.requestStageResolver(data);
    const row = new Row(rowAdapter, this.createActions(data, abstractSandboxService));
    row.addLink('name', navigator.toAllocationRequest(data.poolId, data.allocationRequest.id));
    return row;
  }

  private static createActions(data: AbstractSandbox, abstractSandboxService: AbstractSandboxService): RowAction[] {
    const actions = [
      new DeleteAction(
        'Delete sandbox instance',
        of(data.cleanupRequest != null),
        defer(() => abstractSandboxService.cleanupMultiple(data.poolId, [data.id], true))
      ),
      new RowAction(
        'topology',
        'Topology',
        'device_hub',
        'primary',
        'Display topology',
        of(!data.buildFinished()),
        defer(() => abstractSandboxService.showTopology(data.poolId, data.sandboxInstance))
      ),
      new RowAction(
        'download_user_ssh_config',
        'Get SSH Config',
        'vpn_key',
        'primary',
        'Download user SSH config',
        of(!data.buildFinished()),
        defer(() => abstractSandboxService.getUserSshAccess(data.id))
      ),
      this.createLockAction(data.sandboxInstance, abstractSandboxService),
    ];

    return actions;
  }

  private static createLockAction(instance: SandboxInstance, service: AbstractSandboxService): RowAction {
    if (instance && instance.isLocked()) {
      return new RowAction(
        'unlock',
        'Unlock',
        'lock_open',
        'primary',
        'Unlock sandbox instance',
        of(instance == null),
        defer(() => service.unlock(instance))
      );
    } else {
      return new RowAction(
        'lock',
        'Lock',
        'lock',
        'primary',
        'Lock sandbox instance',
        of(instance == null),
        defer(() => service.lock(instance))
      );
    }
  }

  private static createDeleteCleanupAction(
    cleanupRequest: CleanupRequest,
    cleanupRequestService: CleanupRequestsService
  ) {
    return new RowAction(
      'delete_cleanup',
      'delete cleanup request',
      'do_not_disturb_on',
      'warn',
      'Delete cleanup request',
      of(false),
      defer(() => cleanupRequestService.delete(cleanupRequest))
    );
  }

  private static lockResolver(sandboxInstance: SandboxInstance) {
    if (sandboxInstance?.isLocked()) {
      return 'locked';
    }
    return 'unlocked';
  }

  private static requestStageResolver(data: AbstractSandbox) {
    if (data.cleanupRequest) {
      return data.cleanupRequest.stages;
    }
    return data.allocationRequest.stages;
  }
}
