import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from 'kypo-sandbox-api';
import { SandboxPoolOverviewComponentsModule } from '../../../../../kypo-sandbox-agenda/src/lib/components/pool/overview/sandbox-pool-overview-components.module';
import { environment } from '../../../environments/environment';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxPoolOverviewRoutingModule } from './sandbox-pool-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    SandboxPoolOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxPoolOverviewRoutingModule,
  ],
})
export class SandboxPoolOverviewModule {}
