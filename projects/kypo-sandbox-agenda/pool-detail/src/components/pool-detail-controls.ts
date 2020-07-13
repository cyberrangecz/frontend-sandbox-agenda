import { SentinelControlItem } from '@sentinel/components/controls';
import { Pool } from 'kypo-sandbox-model';
import { defer, of } from 'rxjs';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';

/**
 * @dynamic
 */
export class PoolDetailControls {
  static readonly ALLOCATE_ACTION_ID = 'allocate';

  static create(pool: Pool, service: SandboxInstanceService): SentinelControlItem[] {
    return [
      new SentinelControlItem(
        this.ALLOCATE_ACTION_ID,
        'Allocate',
        'primary',
        of(pool.isFull()),
        defer(() => service.allocate(pool.id))
      ),
    ];
  }
}
