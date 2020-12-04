import { NgModule } from '@angular/core';
import { SandboxDefinitionEditComponentsModule } from '@muni-kypo-crp/sandbox-agenda/sandbox-definition-edit';
import { EditSandboxDefinitionRoutingModule } from './edit-sandbox-definition-routing.module';

@NgModule({
  imports: [SandboxDefinitionEditComponentsModule, EditSandboxDefinitionRoutingModule],
})
export class EditSandboxDefinitionModule {}
