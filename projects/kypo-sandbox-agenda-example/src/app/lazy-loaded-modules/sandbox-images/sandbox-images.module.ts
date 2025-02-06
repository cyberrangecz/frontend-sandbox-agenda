import { NgModule } from '@angular/core';
import { KypoSandboxApiModule } from '@cyberrangecz-platform/sandbox-api';
import { environmentLocal } from '../../../environments/environment.local';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxImagesOverviewRoutingModule } from './sandbox-images-overview-routing.module';
import { ImagesPageModule } from '@cyberrangecz-platform/sandbox-agenda/sandbox-images';

@NgModule({
  imports: [
    SharedProvidersModule,
    KypoSandboxApiModule.forRoot(environmentLocal.sandboxApiConfig),
    ImagesPageModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxImagesOverviewRoutingModule,
  ],
})
export class SandboxImagesOverviewModule {}
