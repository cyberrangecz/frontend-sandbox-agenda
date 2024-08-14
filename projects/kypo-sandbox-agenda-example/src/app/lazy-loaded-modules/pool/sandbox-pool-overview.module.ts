import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { PoolOverviewComponentsModule } from '@muni-kypo-crp/sandbox-agenda/pool-overview';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxPoolOverviewRoutingModule } from './sandbox-pool-overview-routing.module';
import { KypoTrainingApiModule } from '@muni-kypo-crp/training-api';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    KypoTrainingApiModule.forRoot(environmentLocal.trainingApiConfig),
    PoolOverviewComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxPoolOverviewRoutingModule,
  ],
})
export class SandboxPoolOverviewModule {}
