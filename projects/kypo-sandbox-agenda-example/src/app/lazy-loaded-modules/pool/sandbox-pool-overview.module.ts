import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { PoolOverviewComponentsModule } from '@muni-kypo-crp/sandbox-agenda/pool-overview';
import { environment } from '../../../environments/environment';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxPoolOverviewRoutingModule } from './sandbox-pool-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    PoolOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxPoolOverviewRoutingModule,
  ],
})
export class SandboxPoolOverviewModule {}
