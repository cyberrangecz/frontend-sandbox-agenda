import { NetworkingAnsibleCleanupStage, UserAnsibleCleanupStage, OpenStackCleanupStage } from 'kypo-sandbox-model';
import { StageDetailBasicInfo } from './stage-detail-basic-info';
import { StageDetailState } from './stage-detail-state';

export class CleanupStageDetailState extends StageDetailState {
  basicInfo: StageDetailBasicInfo<NetworkingAnsibleCleanupStage | UserAnsibleCleanupStage | OpenStackCleanupStage>;

  constructor(
    basicInfo: StageDetailBasicInfo<NetworkingAnsibleCleanupStage | UserAnsibleCleanupStage | OpenStackCleanupStage>
  ) {
    super(basicInfo);
  }
}
