import { NgModule } from '@angular/core';
import { SandboxDefinitionOverviewComponentsModule } from 'kypo-sandbox-agenda';
import { KypoSandboxApiModule } from 'kypo-sandbox-api';
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
