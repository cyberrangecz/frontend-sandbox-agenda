import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PoolRowAdapter } from '../../model/pool-row-adapter';

@Component({
  selector: 'kypo-pool-expand-detail',
  templateUrl: './pool-expand-detail.component.html',
  styleUrls: ['./pool-expand-detail.component.css'],
})
export class PoolExpandDetailComponent implements AfterViewInit {
  @Input() data: PoolRowAdapter;

  displayedResources = ['instances', 'vcpu', 'ram', 'port', 'network'];
  resourceColors = ['#3D54AF', '#a91e62', '#0ebfb7', '#e56c1b', '#7f007e'];
  detailHeight = '120';

  ngAfterViewInit(): void {
    const element = document.getElementsByClassName('resource-content')[0];
    this.detailHeight = window.getComputedStyle(element)?.height;
  }
}
