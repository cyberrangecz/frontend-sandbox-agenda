import { StageAdapter } from './stage-adapter';
import { UserAnsibleAllocationStage } from '@muni-kypo-crp/sandbox-model';

export class AnsibleStageAdapter extends UserAnsibleAllocationStage implements StageAdapter {
  detailDisabled: boolean;
  hasDetail: boolean;
  logoSrc: string;
  title: string;
  hasError: boolean;
}
