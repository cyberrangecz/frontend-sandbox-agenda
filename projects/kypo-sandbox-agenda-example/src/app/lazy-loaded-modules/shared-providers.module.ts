import { NgModule } from '@angular/core';
import { SandboxErrorHandler } from '../../../../kypo-sandbox-agenda/src/lib/services/client/sandbox-error.handler';
import { SandboxNotificationService } from '../../../../kypo-sandbox-agenda/src/lib/services/client/sandbox-notification.service';
import { ClientErrorHandlerService } from '../services/client-error-handler.service';
import { ClientNotificationService } from '../services/client-notification.service';

@NgModule({
  providers: [
    { provide: SandboxErrorHandler, useClass: ClientErrorHandlerService },
    { provide: SandboxNotificationService, useClass: ClientNotificationService },
  ],
})
export class SharedProvidersModule {}
