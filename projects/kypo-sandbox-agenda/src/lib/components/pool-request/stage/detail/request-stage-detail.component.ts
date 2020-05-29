import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KypoBaseComponent, KypoRequestedPagination } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { RequestStageType } from 'kypo-sandbox-model';

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
  @Input() stage: RequestStage;
  @Output() fetchStageDetail: EventEmitter<KypoRequestedPagination> = new EventEmitter();

  stageTypes = RequestStageType;

  ngOnInit() {}

  onFetchStageDetail(pagination: KypoRequestedPagination) {
    this.fetchStageDetail.emit(pagination);
  }
}
