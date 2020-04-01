import {Pool} from 'kypo-sandbox-model';
import {defer, of} from 'rxjs';
import {KypoControlItem} from 'kypo-controls';
import {SandboxInstanceService} from '../../../services/sandbox-instance/sandbox-instance.service';

export class SandboxPoolDetailControls {
  static readonly ALLOCATE_ACTION_ID = 'allocate';

  static create(pool: Pool, service: SandboxInstanceService): KypoControlItem[] {
    return  [
      new KypoControlItem(
        this.ALLOCATE_ACTION_ID,
        'Allocate',
        'primary',
        of(pool.isFull()),
        defer(() => service.allocate(pool.id))
      )
    ];
  }
}
