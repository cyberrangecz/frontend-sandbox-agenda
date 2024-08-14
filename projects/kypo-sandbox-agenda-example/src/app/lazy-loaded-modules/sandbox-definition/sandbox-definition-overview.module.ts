import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinitionOverviewComponentsModule } from '@muni-kypo-crp/sandbox-agenda/sandbox-definition-overview';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxDefinitionOverviewRoutingModule } from './sandbox-definition-overview-routing.module';
import { KypoTrainingApiModule } from '@muni-kypo-crp/training-api';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    KypoTrainingApiModule.forRoot(environmentLocal.trainingApiConfig),
    SandboxDefinitionOverviewComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxDefinitionOverviewRoutingModule,
  ],
})
export class SandboxDefinitionOverviewModule {}
