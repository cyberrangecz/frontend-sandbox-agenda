import { RequestStage } from '@muni-kypo-crp/sandbox-model';

export interface StageAdapter extends RequestStage {
  logoSrc: string;
  title: string;
  hasDetail: boolean;
  hasError: boolean;
  isExpanded: boolean;
  detailDisabled: boolean;
}
