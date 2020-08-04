import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { StageDetailComponentEnum } from '../../../model/utils/stage-detail-component-enum';
import { StageAdapter } from '../../../model/adapters/stage-adapter';
import { StageComponentResolver } from '../../../model/utils/stage-component-resolver';

/**
 * Component inserting concrete component based on request stage type
 */
@Component({
  selector: 'kypo-request-stage-detail',
  templateUrl: './request-stage-detail.component.html',
  styleUrls: ['./request-stage-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStageDetailComponent extends SentinelBaseDirective implements OnInit, OnChanges {
  @Input() stage: StageAdapter;
  stageComponents = StageDetailComponentEnum;
  stageComponentToDisplay: StageDetailComponentEnum;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('stage' in changes && this.stage) {
      this.stageComponentToDisplay = StageComponentResolver.resolve(this.stage?.type);
    }
  }
}
