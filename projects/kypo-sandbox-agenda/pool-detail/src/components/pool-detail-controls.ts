import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { defer, EMPTY, of } from 'rxjs';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';
import { AbstractSandbox } from '../model/abstract-sandbox';
import { map, switchMap } from 'rxjs/operators';
import { SandboxAllocationUnitsService } from '../services/state/sandbox-allocation-unit/sandbox-allocation-units.service';
import { AbstractSandboxService } from '../services/abstract-sandbox/abstract-sandbox.service';

/**
 * @dynamic
 */
export class PoolDetailControls {
  static readonly ALLOCATE_ACTION_ID = 'allocate';
  static readonly DELETE_FAILED_ACTION_ID = 'delete_failed';
  static readonly DELETE_ALL_ACTION_ID = 'delete_all';

  static create(
    pool: Pool,
    sandboxes: AbstractSandbox[],
    abstractSandboxService: AbstractSandboxService
  ): SentinelControlItem[] {
    return [
      new SentinelControlItem(
        this.ALLOCATE_ACTION_ID,
        'Allocate All',
        'primary',
        of(pool.maxSize === sandboxes.length),
        defer(() => abstractSandboxService.allocate(pool.id))
      ),
      new SentinelControlItem(
        this.DELETE_FAILED_ACTION_ID,
        'Delete Failed',
        'warn',
        of(PoolDetailControls.someSandboxFailedAndHasNoRunningCleanup(sandboxes)),
        defer(() =>
          abstractSandboxService.cleanupMultiple(pool.id, PoolDetailControls.getFailedSandboxesIds(sandboxes), true)
        )
      ),
      new SentinelControlItem(
        this.DELETE_ALL_ACTION_ID,
        'Delete All',
        'warn',
        of(PoolDetailControls.someSandboxHasNoRunningCleanup(sandboxes)),
        defer(() =>
          abstractSandboxService.cleanupMultiple(
            pool.id,
            sandboxes.map((sandbox) => sandbox.id),
            true
          )
        )
      ),
    ];
  }

  private static someSandboxFailedAndHasNoRunningCleanup(sandboxes: AbstractSandbox[]) {
    return !sandboxes.some((sandbox) => sandbox.allocationFailed() && !sandbox.cleanupRunning());
  }

  private static someSandboxHasNoRunningCleanup(sandboxes: AbstractSandbox[]) {
    return !sandboxes.some((sandbox) => !sandbox.cleanupRunning());
  }

  private static getFailedSandboxesIds(sandboxes: AbstractSandbox[]) {
    return sandboxes.filter((sandbox) => sandbox.allocationFailed()).map((sandbox) => sandbox.id);
  }
}
