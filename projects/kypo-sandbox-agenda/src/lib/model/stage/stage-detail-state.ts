import { RequestStage } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';
import { StageDetailBasicInfo } from './stage-detail-basic-info';

export abstract class StageDetailState {
  basicInfo: StageDetailBasicInfo<RequestStage>;
  additionalInfo: StageDetailAdditionalInfo[] = [];

  protected constructor(stage: StageDetailBasicInfo<RequestStage>, additionalInfo: StageDetailAdditionalInfo[] = []) {
    this.basicInfo = stage;
    this.additionalInfo = additionalInfo;
  }

  hasError(): boolean {
    return this?.basicInfo?.hasError || this.additionalInfo.some((info) => info.hasError);
  }
}
