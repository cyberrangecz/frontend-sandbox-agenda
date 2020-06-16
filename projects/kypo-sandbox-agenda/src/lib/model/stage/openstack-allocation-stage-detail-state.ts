import { KypoPaginatedResource } from 'kypo-common';
import { OpenStackAllocationStage, OpenstackEvent, OpenstackResource } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';
import { StageDetailBasicInfo } from './stage-detail-basic-info';
import { StageDetailState } from './stage-detail-state';

export class OpenstackAllocationStageDetailState extends StageDetailState {
  basicInfo: StageDetailBasicInfo<OpenStackAllocationStage>;
  constructor(basicInfo: StageDetailBasicInfo<OpenStackAllocationStage>, additionalInfo: StageDetailAdditionalInfo[]) {
    super(basicInfo, additionalInfo);
  }
}
