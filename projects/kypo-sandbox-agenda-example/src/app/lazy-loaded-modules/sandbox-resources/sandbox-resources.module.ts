import { ResourcesPageModule } from './../../../../../kypo-sandbox-agenda/sandbox-resources/src/components/resources-page.module';
import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxResourcesOverviewRoutingModule } from './sandbox-resources-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    ResourcesPageModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxResourcesOverviewRoutingModule,
  ],
})
export class SandboxResourcesOverviewModule {}
