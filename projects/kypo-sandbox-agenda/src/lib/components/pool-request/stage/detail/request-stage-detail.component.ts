import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { KypoBaseDirective } from 'kypo-common';
import { RequestStageType } from 'kypo-sandbox-model';
import { StageDetailState } from '../../../../model/stage/stage-detail-state';
import { StageDetailComponentEnum } from '../../../../model/stage/stage-detail-component-enum';

/**
 * Component inserting concrete component based on request stage type
 */
@Component({
  selector: 'kypo-request-stage-detail',
  templateUrl: './request-stage-detail.component.html',
  styleUrls: ['./request-stage-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStageDetailComponent extends KypoBaseDirective implements OnInit, OnChanges {
  @Input() stageDetail: StageDetailState;
  @Output() fetchStageDetail: EventEmitter<StageDetailState> = new EventEmitter();
  stageComponents = StageDetailComponentEnum;
  stageComponentToDisplay: StageDetailComponentEnum;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('stageDetail' in changes && this.stageDetail) {
      this.stageComponentToDisplay = this.resolveStageComponent(this.stageDetail?.basicInfo?.stage?.type);
    }
  }

  onFetchStageDetail(stageDetail: StageDetailState) {
    this.fetchStageDetail.emit(stageDetail);
  }

  private resolveStageComponent(type: RequestStageType): StageDetailComponentEnum {
    switch (type) {
      case RequestStageType.NETWORKING_ANSIBLE_ALLOCATION: {
        return StageDetailComponentEnum.ANSIBLE_ALLOCATION;
      }
      case RequestStageType.USER_ANSIBLE_ALLOCATION: {
        return StageDetailComponentEnum.ANSIBLE_ALLOCATION;
      }
      case RequestStageType.OPEN_STACK_ALLOCATION: {
        return StageDetailComponentEnum.OPEN_STACK_ALLOCATION;
      }
      default: {
        return StageDetailComponentEnum.CLEANUP;
      }
    }
  }
}
