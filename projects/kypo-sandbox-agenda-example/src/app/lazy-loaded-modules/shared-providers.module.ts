import { NgModule } from '@angular/core';
import { SandboxNotificationService, SandboxErrorHandler } from 'kypo-sandbox-agenda';
import { ClientErrorHandlerService } from '../services/client-error-handler.service';
import { ClientNotificationService } from '../services/client-notification.service';

@NgModule({
  providers: [
    { provide: SandboxErrorHandler, useClass: ClientErrorHandlerService },
    { provide: SandboxNotificationService, useClass: ClientNotificationService },
  ],
})
export class SharedProvidersModule {}
