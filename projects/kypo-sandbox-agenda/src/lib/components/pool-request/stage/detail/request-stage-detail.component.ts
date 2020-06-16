import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KypoBaseComponent, KypoRequestedPagination } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { RequestStageType } from 'kypo-sandbox-model';
import { StageDetailState } from '../../../../model/stage/stage-detail-state';

/**
 * Component inserting concrete component based on request stage type
 */
@Component({
  selector: 'kypo-request-stage-detail',
  templateUrl: './request-stage-detail.component.html',
  styleUrls: ['./request-stage-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStageDetailComponent extends KypoBaseComponent implements OnInit {
  @Input() stageDetail: StageDetailState;
  @Output() fetchStageDetail: EventEmitter<StageDetailState> = new EventEmitter();

  stageTypes = RequestStageType;

  ngOnInit() {}

  onFetchStageDetail(stageDetail: StageDetailState) {
    this.fetchStageDetail.emit(stageDetail);
  }
}
