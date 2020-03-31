import {CreateSandboxDefinitionComponentsModule} from 'kypo-sandbox-agenda';
import {NgModule} from '@angular/core';
import {environment} from '../../environments/environment';
import {CreateSandboxDefinitionRoutingModule} from './create-sandbox-definition-routing.module';

@NgModule({
  imports: [
    CreateSandboxDefinitionComponentsModule.forRoot(environment.sandboxAgendaConfig),
    CreateSandboxDefinitionRoutingModule
  ]
})
export class CreateSandboxDefinitionModule {

}
