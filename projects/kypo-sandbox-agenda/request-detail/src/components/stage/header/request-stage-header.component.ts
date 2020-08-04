import { Component, Input, OnInit } from '@angular/core';
import { RequestStageState } from 'kypo-sandbox-model';
import { StageAdapter } from '../../../model/adapters/stage-adapter';

@Component({
  selector: 'kypo-request-stage-header',
  templateUrl: './request-stage-header.component.html',
  styleUrls: ['./request-stage-header.component.scss'],
})
export class RequestStageHeaderComponent implements OnInit {
  @Input() stage: StageAdapter;
  stageStates = RequestStageState;

  constructor() {}

  ngOnInit(): void {}
}
