import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@muni-kypo-crp/sandbox-api';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxImagesOverviewRoutingModule } from './sandbox-images-overview-routing.module';
import { ImagesPageModule } from '@muni-kypo-crp/sandbox-agenda/sandbox-images';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    ImagesPageModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxImagesOverviewRoutingModule,
  ],
})
export class SandboxImagesOverviewModule {}
