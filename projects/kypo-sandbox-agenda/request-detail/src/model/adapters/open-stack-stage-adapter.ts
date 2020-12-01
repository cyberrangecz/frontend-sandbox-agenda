import { OpenStackAllocationStage } from '@kypo/sandbox-model';
import { StageAdapter } from './stage-adapter';

export class OpenStackStageAdapter extends OpenStackAllocationStage implements StageAdapter {
  detailDisabled: boolean;
  hasDetail: boolean;
  logoSrc: string;
  title: string;
  hasError: boolean;
}
