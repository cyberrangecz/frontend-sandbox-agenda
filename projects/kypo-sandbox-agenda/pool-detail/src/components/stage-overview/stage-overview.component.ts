import { Component, Input, OnInit } from '@angular/core';
import { RequestStageState } from '@muni-kypo-crp/sandbox-model';

@Component({
  selector: 'kypo-stage-overview',
  templateUrl: './stage-overview.component.html',
  styleUrls: ['./stage-overview.component.scss'],
})
export class StageOverviewComponent {
  @Input() stages;

  stageIconResolver(stage: string): string {
    switch (stage) {
      case RequestStageState.RUNNING:
        return 'incomplete_circle';
      case RequestStageState.FINISHED:
        return 'check';
      case RequestStageState.FAILED:
        return 'close';
      case RequestStageState.IN_QUEUE:
        return 'pause';
      default:
        return '';
    }
  }
}
