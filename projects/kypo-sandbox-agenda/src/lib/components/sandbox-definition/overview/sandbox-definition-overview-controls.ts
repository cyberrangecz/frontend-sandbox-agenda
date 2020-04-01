import {SandboxDefinitionOverviewService} from '../../../services/sandbox-definition/sandbox-definition-overview.service';
import {defer, of} from 'rxjs';
import {KypoControlItem} from 'kypo-controls';

/**
 * @dynamic
 */
export class SandboxDefinitionOverviewControls {

  static readonly CREATE_ACTION_ID = 'create';

  /**
   *
   * @param service
   */
  static create(service: SandboxDefinitionOverviewService): KypoControlItem[] {
    return [
      new KypoControlItem(
        this.CREATE_ACTION_ID,
        'Create',
        'primary',
        of(false),
        defer(() => service.create())
      )
    ];
  }
}
