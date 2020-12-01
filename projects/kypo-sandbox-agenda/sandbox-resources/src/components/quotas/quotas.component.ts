import { Resources } from '@kypo/sandbox-model';
import { SentinelBaseDirective } from '@sentinel/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kypo-quotas',
  templateUrl: './quotas.component.html',
  styleUrls: ['./quotas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotasComponent extends SentinelBaseDirective implements OnInit {
  @Input() resources;

  displayedResources = ['instances', 'vcpu', 'ram'];

  constructor() {
    super();
  }

  ngOnInit() {}
}
