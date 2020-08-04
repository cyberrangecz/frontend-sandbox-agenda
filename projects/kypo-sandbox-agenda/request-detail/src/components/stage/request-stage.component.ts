import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { StageAdapter } from '../../model/adapters/stage-adapter';

/**
 * Component of request stage basic info
 */
@Component({
  selector: 'kypo-request-stage',
  templateUrl: './request-stage.component.html',
  styleUrls: ['./request-stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStageComponent extends SentinelBaseDirective {
  @Input() stage: StageAdapter;
  @Output() stageDetailPanelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onPanelStateChange(opened: boolean) {
    this.stageDetailPanelChange.emit(opened);
  }
}
