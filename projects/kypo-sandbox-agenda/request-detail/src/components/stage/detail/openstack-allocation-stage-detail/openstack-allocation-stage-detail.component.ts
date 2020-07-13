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
import { SentinelBaseDirective, PaginatedResource, RequestedPagination } from '@sentinel/common';
import { OpenStackAllocationStageDetailState } from '../../../../model/open-stack-allocation-stage-detail-state';
import { StageDetailState } from '../../../../model/stage-detail-state';

@Component({
  selector: 'kypo-openstack-allocation-stage-detail',
  templateUrl: './openstack-allocation-stage-detail.component.html',
  styleUrls: ['./openstack-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenstackAllocationStageDetailComponent extends SentinelBaseDirective implements OnInit, OnChanges {
  @Input() stageDetail: OpenStackAllocationStageDetailState;
  @Output() fetchStageDetail: EventEmitter<StageDetailState> = new EventEmitter();

  status: string;
  statusReason: string;
  resources: PaginatedResource<string>;
  hasResources: boolean;
  events: PaginatedResource<string>;
  hasEvents: boolean;
  resourcesPageSize = 100;
  eventsPageSize = 100;
  isLoading = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('stageDetail' in changes && this.stageDetail) {
      this.isLoading = false;
      this.status = this.stageDetail?.basicInfo?.stage?.status;
      this.statusReason = this.stageDetail?.basicInfo?.stage?.statusReason;
      this.resources = this.stageDetail?.additionalInfo[0]?.content;
      this.events = this.stageDetail?.additionalInfo[1]?.content;
      this.resourcesPageSize = this.stageDetail?.additionalInfo[0]?.content?.pagination?.size;
      this.eventsPageSize = this.stageDetail?.additionalInfo[1]?.content?.pagination?.size;
      this.hasResources = this.resources && this.resources?.elements?.length > 0;
      this.hasEvents = this.events && this.events?.elements?.length > 0;
    }
  }

  onFetch(requestedPagination: RequestedPagination, index: number) {
    this.isLoading = true;
    this.stageDetail.additionalInfo[index].requestedPagination = requestedPagination;
    this.fetchStageDetail.emit(this.stageDetail);
  }
}
