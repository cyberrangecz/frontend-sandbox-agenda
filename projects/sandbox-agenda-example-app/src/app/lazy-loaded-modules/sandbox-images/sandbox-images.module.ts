import { NgModule } from '@angular/core';
import { SandboxApiModule } from '@crczp/sandbox-api';
import { SharedProvidersModule } from '../shared-providers.module';
import { SandboxImagesOverviewRoutingModule } from './sandbox-images-overview-routing.module';
import { ImagesPageModule } from '@crczp/sandbox-agenda/sandbox-images';
import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
        SharedProvidersModule,
        SandboxApiModule.forRoot(environment.sandboxApiConfig),
        ImagesPageModule.forRoot(environment.sandboxAgendaConfig),
        SandboxImagesOverviewRoutingModule,
    ],
})
export class SandboxImagesOverviewModule {}
