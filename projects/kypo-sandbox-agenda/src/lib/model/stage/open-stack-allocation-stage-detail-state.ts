import { OpenStackAllocationStage } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';
import { StageDetailBasicInfo } from './stage-detail-basic-info';
import { StageDetailState } from './stage-detail-state';

export class OpenStackAllocationStageDetailState extends StageDetailState {
  basicInfo: StageDetailBasicInfo<OpenStackAllocationStage>;
  constructor(basicInfo: StageDetailBasicInfo<OpenStackAllocationStage>, additionalInfo: StageDetailAdditionalInfo[]) {
    super(basicInfo, additionalInfo);
  }
}
