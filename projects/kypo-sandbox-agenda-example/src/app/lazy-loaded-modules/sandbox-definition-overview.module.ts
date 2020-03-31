import {NgModule} from '@angular/core';
import {KypoSandboxApiModule} from 'kypo-sandbox-api';
import {environment} from '../../environments/environment';
import {SandboxDefinitionOverviewComponentsModule, SandboxErrorHandlerService, SandboxNotificationService} from 'kypo-sandbox-agenda';
import {ClientErrorHandlerService} from '../services/client-error-handler.service';
import {ClientNotificationService} from '../services/client-notification.service';
import {SandboxDefinitionOverviewRoutingModule} from './sandbox-definition-overview-routing.module';

@NgModule({
  imports: [
    KypoSandboxApiModule.forRoot(environment.sandboxApiConfig),
    SandboxDefinitionOverviewComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxDefinitionOverviewRoutingModule
  ],
  providers: [
    {provide: SandboxErrorHandlerService, useClass: ClientErrorHandlerService},
    {provide: SandboxNotificationService, useClass: ClientNotificationService}
  ]
})
export class SandboxDefinitionOverviewModule {
}
