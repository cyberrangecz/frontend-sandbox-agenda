import { AllocationRequestStage, RequestStage } from '@muni-kypo-crp/sandbox-model';
import {
  ANSIBLE_NETWORKING_TYPES,
  ANSIBLE_STAGE_TYPES,
  ANSIBLE_USER_TYPES,
  OPENSTACK_STAGE_TYPES,
} from '../utils/stage-types';
import { ANSIBLE_LOGO_SRC, OPENSTACK_LOGO_SRC } from '../utils/stage-logos';
import { StageAdapter } from './stage-adapter';

export class StageAdapterMapper {
  static fromStage(stage: RequestStage): StageAdapter {
    const adapter = stage as StageAdapter;
    adapter.logoSrc = this.resolveLogoSrc(stage);
    adapter.title = this.resolveTitle(stage);
    adapter.hasDetail = this.resolveHasDetail(stage);
    adapter.detailDisabled = this.resolveDetailDisabled(stage);
    return adapter;
  }

  private static resolveLogoSrc(stage: RequestStage): string {
    if (OPENSTACK_STAGE_TYPES.includes(stage.type)) {
      return OPENSTACK_LOGO_SRC;
    } else if (ANSIBLE_STAGE_TYPES.includes(stage.type)) {
      return ANSIBLE_LOGO_SRC;
    }
  }

  private static resolveTitle(stage: RequestStage): string {
    if (OPENSTACK_STAGE_TYPES.includes(stage.type)) {
      return `OpenStack Stage ${stage.id}`;
    } else if (ANSIBLE_NETWORKING_TYPES.includes(stage.type)) {
      return `Networking Ansible Stage ${stage.id}`;
    } else if (ANSIBLE_USER_TYPES.includes(stage.type)) {
      return `User Ansible Stage ${stage.id}`;
    }
  }

  private static resolveHasDetail(stage: RequestStage): boolean {
    return stage instanceof AllocationRequestStage;
  }

  private static resolveDetailDisabled(stage: RequestStage): boolean {
    return stage.isInQueue();
  }
}
