import { StageAdapter } from './stage-adapter';
import { UserAnsibleAllocationStage } from '@cyberrangecz-platform/sandbox-model';

export class AnsibleStageAdapter extends UserAnsibleAllocationStage implements StageAdapter {
  detailDisabled: boolean;
  hasDetail: boolean;
  logoSrc: string;
  title: string;
  hasError: boolean;
  isExpanded: boolean;
}
