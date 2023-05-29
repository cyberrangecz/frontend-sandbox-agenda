import { SentinelBaseDirective } from '@sentinel/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'kypo-quotas',
  templateUrl: './quotas.component.html',
  styleUrls: ['./quotas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotasComponent extends SentinelBaseDirective {
  @Input() resources;

  displayedResources = ['instances', 'vcpu', 'ram', 'port', 'network'];

  constructor() {
    super();
  }
}
