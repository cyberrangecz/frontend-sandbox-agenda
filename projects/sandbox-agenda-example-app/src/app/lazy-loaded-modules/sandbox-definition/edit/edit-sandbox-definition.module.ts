import { NgModule } from '@angular/core';
import { SandboxDefinitionEditComponentsModule } from '@crczp/sandbox-agenda/sandbox-definition-edit';
import { EditSandboxDefinitionRoutingModule } from './edit-sandbox-definition-routing.module';

@NgModule({
    imports: [SandboxDefinitionEditComponentsModule, EditSandboxDefinitionRoutingModule],
})
export class EditSandboxDefinitionModule {}
