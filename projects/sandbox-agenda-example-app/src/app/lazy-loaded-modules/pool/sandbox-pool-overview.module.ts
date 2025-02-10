import { NgModule } from '@angular/core';
import { SandboxApiModule } from '@cyberrangecz-platform/sandbox-api';
import { PoolOverviewComponentsModule } from '@cyberrangecz-platform/sandbox-agenda/pool-overview';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxPoolOverviewRoutingModule } from './sandbox-pool-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    SandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    PoolOverviewComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxPoolOverviewRoutingModule,
  ],
})
export class SandboxPoolOverviewModule {}
