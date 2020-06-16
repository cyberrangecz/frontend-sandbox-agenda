import { Component, OnInit } from '@angular/core';
import { KypoInfiniteScroller } from 'kypo-list';

@Component({
  selector: 'kypo-code-viewer',
  templateUrl: './code-viewer.component.html',
  styleUrls: ['./code-viewer.component.css'],
})
export class CodeViewerComponent extends KypoInfiniteScroller<string> implements OnInit {
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
