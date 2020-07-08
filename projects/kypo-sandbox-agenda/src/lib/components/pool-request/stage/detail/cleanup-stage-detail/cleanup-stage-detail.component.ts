import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { CleanupStageDetailState } from '../../../../../model/stage/cleanup-stage-detail-state';

@Component({
  selector: 'kypo-cleanup-stage-detail',
  templateUrl: './cleanup-stage-detail.component.html',
  styleUrls: ['./cleanup-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanupStageDetailComponent extends SentinelBaseDirective implements OnInit {
  @Input() stageDetail: CleanupStageDetailState;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
