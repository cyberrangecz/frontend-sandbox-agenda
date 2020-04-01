import {NgModule} from '@angular/core';
import {SharedProvidersModule} from '../shared-providers.module';
import {KypoSandboxApiModule} from 'kypo-sandbox-api';
import {environment} from '../../../environments/environment';
import {SandboxPoolOverviewComponentsModule} from 'kypo-sandbox-agenda';
import {SandboxPoolOverviewRoutingModule} from './sandbox-pool-overview-routing.module';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    SandboxPoolOverviewComponentsModule,
    SandboxPoolOverviewRoutingModule
  ]
})
export class SandboxPoolOverviewModule {

}
