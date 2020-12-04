import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinitionOverviewComponentsModule } from '@muni-kypo-crp/sandbox-agenda/sandbox-definition-overview';
import { environment } from '../../../environments/environment';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxDefinitionOverviewRoutingModule } from './sandbox-definition-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    SandboxDefinitionOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxDefinitionOverviewRoutingModule,
  ],
})
export class SandboxDefinitionOverviewModule {}
