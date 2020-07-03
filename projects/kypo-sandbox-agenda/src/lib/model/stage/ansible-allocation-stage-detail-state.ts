import { StageDetailAdditionalInfo } from './stage-detail-additional-info';
import { StageDetailBasicInfo } from './stage-detail-basic-info';
import { StageDetailState } from './stage-detail-state';
import { AnsibleAllocationStage } from '../types/stages';

export class AnsibleAllocationStageDetailState extends StageDetailState {
  basicInfo: StageDetailBasicInfo<AnsibleAllocationStage>;
  constructor(basicInfo: StageDetailBasicInfo<AnsibleAllocationStage>, additionalInfo: StageDetailAdditionalInfo[]) {
    super(basicInfo, additionalInfo);
  }
}
