export class StageDetailBasicInfo<T> {
  stage: T;
  hasError: boolean;

  constructor(stage: T, hasError: boolean = false) {
    this.stage = stage;
    this.hasError = hasError;
  }
}
