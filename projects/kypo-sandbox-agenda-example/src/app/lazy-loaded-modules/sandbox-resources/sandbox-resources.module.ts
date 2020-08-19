import { SandboxResourcesModule } from './../../../../../kypo-sandbox-agenda/sandbox-resources/src/components/sandbox-resources.module';
import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from 'kypo-sandbox-api';
import { environment } from '../../../environments/environment';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxResourcesOverviewRoutingModule } from './sandbox-resources-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    SandboxResourcesModule,
    SandboxResourcesOverviewRoutingModule,
  ],
})
export class SandboxResourcesOverviewModule {}
