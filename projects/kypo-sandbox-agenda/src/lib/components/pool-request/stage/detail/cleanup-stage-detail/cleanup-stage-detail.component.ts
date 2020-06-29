import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { KypoBaseDirective } from 'kypo-common';
import { CleanupStageDetailState } from '../../../../../model/stage/cleanup-stage-detail-state';

@Component({
  selector: 'kypo-cleanup-stage-detail',
  templateUrl: './cleanup-stage-detail.component.html',
  styleUrls: ['./cleanup-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanupStageDetailComponent extends KypoBaseDirective implements OnInit {
  @Input() stageDetail: CleanupStageDetailState;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
