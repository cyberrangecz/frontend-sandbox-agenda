import { NgModule } from '@angular/core';
import { SandboxApiModule } from '@cyberrangecz-platform/sandbox-api';
import { SandboxDefinitionOverviewComponentsModule } from '@cyberrangecz-platform/sandbox-agenda/sandbox-definition-overview';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxDefinitionOverviewRoutingModule } from './sandbox-definition-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    SandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    SandboxDefinitionOverviewComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxDefinitionOverviewRoutingModule,
  ],
})
export class SandboxDefinitionOverviewModule {}
