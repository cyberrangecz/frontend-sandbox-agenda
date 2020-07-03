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
import { OpenStackAllocationStage, OpenStackCleanupStage, RequestStage } from 'kypo-sandbox-model';
import { CleanupRequestStage } from 'kypo-sandbox-model';
import { StageDetailEventType } from '../../../model/stage/stage-detail-event-type';
import { StageDetailPanelEvent } from '../../../model/stage/stage-detail-panel-event';
import { StageDetailState } from '../../../model/stage/stage-detail-state';
import { ANSIBLE_LOGO_SRC, OPENSTACK_LOGO_SRC } from '../../../model/stage/stage-logos';

/**
 * Component of request stage basic info
 */
@Component({
  selector: 'kypo-request-stage',
  templateUrl: './request-stage.component.html',
  styleUrls: ['./request-stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStageComponent extends KypoBaseDirective implements OnInit, OnChanges {
  @Input() stage: RequestStage;
  @Input() stageDetail: StageDetailState;
  @Output() stageDetailPanelEvent: EventEmitter<StageDetailPanelEvent> = new EventEmitter();
  @Output() fetchStageDetail: EventEmitter<StageDetailState> = new EventEmitter();

  stageDetailIsLoading = false;
  stageTitle: string;
  stageLogoSrc: string;
  detailDisabled: boolean;
  stageDetailHasError: boolean;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('stage' in changes) {
      this.resolveStagePresentationalInfo();
      this.resolveStageDetailPanelState();
    }
    if ('stageDetail' in changes) {
      this.stageDetailIsLoading = false;
      this.stageDetailHasError = this.stageDetail?.hasError();
    }
  }

  /**
   * Changes internal state of the component and emits event to the parent component
   * @param open true if stage detail was opened, false if closed
   */
  onPanelStateChanged(open: boolean) {
    this.stageDetailIsLoading = open;
    this.stageDetailPanelEvent.emit(
      new StageDetailPanelEvent(this.stage, open ? StageDetailEventType.OPEN : StageDetailEventType.CLOSE)
    );
  }

  onFetchStageDetail(stageDetail: StageDetailState) {
    this.fetchStageDetail.emit(stageDetail);
  }

  private resolveStagePresentationalInfo() {
    if (this.stage instanceof OpenStackAllocationStage || this.stage instanceof OpenStackCleanupStage) {
      this.stageLogoSrc = OPENSTACK_LOGO_SRC;
      this.stageTitle = `OpenStack Stage ${this.stage.id}`;
    } else {
      this.stageLogoSrc = ANSIBLE_LOGO_SRC;
      this.stageTitle = `Ansible Stage ${this.stage.id}`;
    }
  }

  private resolveStageDetailPanelState() {
    if (this.stage.isInQueue()) {
      this.detailDisabled = true;
    } else {
      this.detailDisabled = this.stage instanceof CleanupRequestStage && this.stage.hasFinished();
    }
  }
}
