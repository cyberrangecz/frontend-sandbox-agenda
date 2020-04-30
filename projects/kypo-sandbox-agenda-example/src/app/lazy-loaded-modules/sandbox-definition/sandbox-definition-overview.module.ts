import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from 'kypo-sandbox-api';
import { SandboxDefinitionOverviewComponentsModule } from '../../../../../kypo-sandbox-agenda/src/lib/components/sandbox-definition/overview/sandbox-definition-overview-components.module';
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
