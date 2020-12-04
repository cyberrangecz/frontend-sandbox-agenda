import { Component, Input, OnInit } from '@angular/core';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';

/**
 * Table detail of expanded row displaying sandbox definition details
 */
@Component({
  selector: 'kypo-sandbox-definition-detail',
  templateUrl: './sandbox-definition-detail.component.html',
  styleUrls: ['./sandbox-definition-detail.component.scss'],
})
export class SandboxDefinitionDetailComponent implements OnInit {
  @Input() data: SandboxDefinition;

  constructor() {}

  ngOnInit() {}
}
