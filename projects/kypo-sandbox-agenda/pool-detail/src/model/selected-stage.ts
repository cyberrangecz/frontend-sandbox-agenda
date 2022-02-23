export class SelectedStage {
  unitId: number;
  state: string;

  constructor(unitId: number, state: string) {
    this.unitId = unitId;
    this.state = state;
  }
}
