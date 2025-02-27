import { NgModule } from '@angular/core';
import { SandboxApiModule } from '@crczp/sandbox-api';
import { PoolOverviewComponentsModule } from '@crczp/sandbox-agenda/pool-overview';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxPoolOverviewRoutingModule } from './sandbox-pool-overview-routing.module';
import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
        SharedProvidersModule,
        SandboxApiModule.forRoot(environment.sandboxApiConfig),
        PoolOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
        SandboxPoolOverviewRoutingModule,
    ],
})
export class SandboxPoolOverviewModule {}
