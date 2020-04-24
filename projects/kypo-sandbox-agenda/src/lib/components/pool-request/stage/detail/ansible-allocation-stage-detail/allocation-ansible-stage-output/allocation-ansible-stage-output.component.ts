import { Component, OnInit } from '@angular/core';
import { KypoInfiniteScroller } from 'kypo-list';

@Component({
  selector: 'kypo-allocation-ansible-stage-output',
  templateUrl: './allocation-ansible-stage-output.component.html',
  styleUrls: ['./allocation-ansible-stage-output.component.css'],
})
export class AllocationAnsibleStageOutputComponent extends KypoInfiniteScroller<string> implements OnInit {
  ngOnInit(): void {}

  /**
   * Scrolls to the end of virtual scroll
   */
  scrollToEnd() {
    this.viewport.scrollToIndex(this.scrollItems.length, 'auto');
  }

  /**
   * Scrolls to the start of virtual scroll
   */
  scrollToStart() {
    this.viewport.scrollToIndex(0, 'auto');
  }
}
