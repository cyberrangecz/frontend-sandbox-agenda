import { NgModule } from '@angular/core';
import { SandboxApiModule } from '@crczp/sandbox-api';
import { SandboxDefinitionOverviewComponentsModule } from '@crczp/sandbox-agenda/sandbox-definition-overview';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxDefinitionOverviewRoutingModule } from './sandbox-definition-overview-routing.module';
import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
        SharedProvidersModule,
        SandboxApiModule.forRoot(environment.sandboxApiConfig),
        SandboxDefinitionOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
        SandboxDefinitionOverviewRoutingModule,
    ],
})
export class SandboxDefinitionOverviewModule {}
