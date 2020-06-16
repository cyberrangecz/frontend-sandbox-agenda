import { AnsibleCleanupStage, OpenStackCleanupStage } from 'kypo-sandbox-model';
import { StageDetailBasicInfo } from './stage-detail-basic-info';
import { StageDetailState } from './stage-detail-state';

export class CleanupStageDetailState extends StageDetailState {
  basicInfo: StageDetailBasicInfo<AnsibleCleanupStage | OpenStackCleanupStage>;

  constructor(basicInfo: StageDetailBasicInfo<AnsibleCleanupStage | OpenStackCleanupStage>) {
    super(basicInfo);
  }
}
