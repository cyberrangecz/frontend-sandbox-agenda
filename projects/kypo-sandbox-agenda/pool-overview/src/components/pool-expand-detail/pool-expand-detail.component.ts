import { Component, Input } from '@angular/core';
import { PoolRowAdapter } from '../../model/pool-row-adapter';

@Component({
  selector: 'kypo-pool-expand-detail',
  templateUrl: './pool-expand-detail.component.html',
  styleUrls: ['./pool-expand-detail.component.css'],
})
export class PoolExpandDetailComponent {
  @Input() data: PoolRowAdapter;
}
