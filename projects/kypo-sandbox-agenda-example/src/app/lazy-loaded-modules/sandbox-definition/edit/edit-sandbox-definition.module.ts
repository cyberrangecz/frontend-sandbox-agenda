import { NgModule } from '@angular/core';
import { EditSandboxDefinitionComponentsModule } from '../../../../../../kypo-sandbox-agenda/src/lib/components/sandbox-definition/edit/edit-sandbox-definition-components.module';
import { EditSandboxDefinitionRoutingModule } from './edit-sandbox-definition-routing.module';

@NgModule({
  imports: [EditSandboxDefinitionComponentsModule, EditSandboxDefinitionRoutingModule],
})
export class EditSandboxDefinitionModule {}
