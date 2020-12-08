import { Component, Input } from '@angular/core';
import { RequestStageState } from '@muni-kypo-crp/sandbox-model';
import { StageAdapter } from '../../../model/adapters/stage-adapter';

@Component({
  selector: 'kypo-request-stage-header',
  templateUrl: './request-stage-header.component.html',
  styleUrls: ['./request-stage-header.component.scss'],
})
export class RequestStageHeaderComponent {
  @Input() stage: StageAdapter;
  stageStates = RequestStageState;
}
