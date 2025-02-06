import { Component, Input } from '@angular/core';
import { SandboxDefinition } from '@cyberrangecz-platform/sandbox-model';

/**
 * Table detail of expanded row displaying sandbox definition details
 */
@Component({
  selector: 'kypo-sandbox-definition-detail',
  templateUrl: './sandbox-definition-detail.component.html',
  styleUrls: ['./sandbox-definition-detail.component.scss'],
})
export class SandboxDefinitionDetailComponent {
  @Input() data: SandboxDefinition;
}
