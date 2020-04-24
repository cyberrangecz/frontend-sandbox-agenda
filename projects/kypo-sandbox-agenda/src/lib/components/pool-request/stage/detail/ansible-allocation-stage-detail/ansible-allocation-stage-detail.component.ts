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
import { KypoBaseComponent, KypoRequestedPagination } from 'kypo-common';
import { AnsibleAllocationStage } from 'kypo-sandbox-model';

@Component({
  selector: 'kypo-ansible-allocation-stage-detail',
  templateUrl: './ansible-allocation-stage-detail.component.html',
  styleUrls: ['./ansible-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnsibleAllocationStageDetailComponent extends KypoBaseComponent implements OnInit, OnChanges {
  @Input() stageDetail: AnsibleAllocationStage;
  @Output() fetchAnsibleOutput: EventEmitter<KypoRequestedPagination> = new EventEmitter();

  isLoading = false;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('stageDetail' in changes && this.stageDetail) {
      this.isLoading = false;
    }
  }

  onFetch(requestedPagination: KypoRequestedPagination) {
    this.isLoading = true;
    this.fetchAnsibleOutput.emit(requestedPagination);
  }
}
