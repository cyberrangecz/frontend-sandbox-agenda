import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { SandboxDefaultNavigator } from '../../../services/client/sandbox-default-navigator.service';
import { SandboxNavigator } from '../../../services/client/sandbox-navigator.service';
import { SandboxAgendaContext } from '../../../services/internal/sandox-agenda-context.service';
import { PoolOverviewConcreteService } from '../../../services/pool/pool-overview-concrete.service';
import { PoolOverviewService } from '../../../services/pool/pool-overview.service';
import { PoolBreadcrumbResolver } from '../../../services/resolvers/pool-breadcrumb-resolver.service';
import { PoolResolver } from '../../../services/resolvers/pool-resolver.service';
import { SandboxPoolOverviewComponent } from './sandbox-pool-overview.component';

/**
 * Module containing components and providers for sandbox pool overview page
 */
@NgModule({
  declarations: [SandboxPoolOverviewComponent],
  imports: [CommonModule, SentinelTableModule, SentinelControlsModule, MatDialogModule],
  providers: [
    PoolResolver,
    PoolBreadcrumbResolver,
    SandboxAgendaContext,
    { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
    { provide: PoolOverviewService, useClass: PoolOverviewConcreteService },
  ],
})
export class SandboxPoolOverviewComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxPoolOverviewComponentsModule> {
    return {
      ngModule: SandboxPoolOverviewComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
