import { KypoRequestedPagination } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';

export class StageDetail {
  stage: RequestStage;
  hasError: boolean;
  requestedPagination: KypoRequestedPagination;

  constructor(stage: RequestStage, hasError = false) {
    this.stage = stage;
    this.hasError = hasError;
  }
}
