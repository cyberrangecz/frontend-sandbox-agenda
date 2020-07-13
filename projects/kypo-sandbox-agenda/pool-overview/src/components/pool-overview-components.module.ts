import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxDefaultNavigator, SandboxNavigator, SandboxAgendaConfig } from 'kypo-sandbox-agenda';
import { SandboxAgendaContext } from 'kypo-sandbox-agenda/internal';
import { PoolOverviewConcreteService } from '../services/state/pool-overview-concrete.service';
import { PoolOverviewService } from '../services/state/pool-overview.service';
import { PoolResolver, PoolBreadcrumbResolver } from 'kypo-sandbox-agenda/resolvers';
import { PoolOverviewComponent } from './pool-overview.component';

/**
 * Module containing components and providers for sandbox pool overview page
 */
@NgModule({
  declarations: [PoolOverviewComponent],
  imports: [CommonModule, SentinelTableModule, SentinelControlsModule, MatDialogModule],
  providers: [
    PoolResolver,
    PoolBreadcrumbResolver,
    SandboxAgendaContext,
    { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
    { provide: PoolOverviewService, useClass: PoolOverviewConcreteService },
  ],
})
export class PoolOverviewComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolOverviewComponentsModule> {
    return {
      ngModule: PoolOverviewComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
