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
import { KypoBaseComponent, KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { AllocationAnsibleStageDetailState } from '../../../../../model/stage/allocation-ansible-stage-detail-state';
import { StageDetailState } from '../../../../../model/stage/stage-detail-state';

@Component({
  selector: 'kypo-ansible-allocation-stage-detail',
  templateUrl: './ansible-allocation-stage-detail.component.html',
  styleUrls: ['./ansible-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnsibleAllocationStageDetailComponent extends KypoBaseComponent implements OnInit, OnChanges {
  @Input() stageDetail: AllocationAnsibleStageDetailState;
  @Output() fetchStageDetail: EventEmitter<StageDetailState> = new EventEmitter();

  repository: string;
  revision: string;
  output: KypoPaginatedResource<string>;
  hasOutput: boolean;

  pageSize = 500;
  isLoading = false;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('stageDetail' in changes && this.stageDetail) {
      this.isLoading = false;
      this.repository = this.stageDetail?.basicInfo?.stage?.repoUrl;
      this.revision = this.stageDetail?.basicInfo?.stage?.rev;
      this.output = this.stageDetail?.additionalInfo[0]?.content;
      this.pageSize = this.output?.pagination?.size;
      this.hasOutput = this.output && this.output?.elements?.length > 0;
    }
  }

  onFetch(requestedPagination: KypoRequestedPagination) {
    this.isLoading = true;
    this.stageDetail.additionalInfo[0].requestedPagination = requestedPagination;
    this.fetchStageDetail.emit(this.stageDetail);
  }
}
