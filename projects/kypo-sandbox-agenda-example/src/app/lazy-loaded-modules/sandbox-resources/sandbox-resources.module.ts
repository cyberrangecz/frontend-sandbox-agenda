import { ResourcesPageModule } from './../../../../../kypo-sandbox-agenda/sandbox-resources/src/components/resources-page.module';
import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@kypo/sandbox-api';
import { environment } from '../../../environments/environment';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxResourcesOverviewRoutingModule } from './sandbox-resources-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    ResourcesPageModule.forRoot(environment.sandboxAgendaConfig),
    SandboxResourcesOverviewRoutingModule,
  ],
})
export class SandboxResourcesOverviewModule {}
