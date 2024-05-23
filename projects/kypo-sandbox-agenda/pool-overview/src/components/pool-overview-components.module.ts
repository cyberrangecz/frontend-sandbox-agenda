import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxDefaultNavigator, SandboxNavigator, SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import {
  SandboxAgendaContext,
  PaginationService,
  SandboxDefinitionOverviewConcreteService,
  SandboxDefinitionOverviewService,
  ResourcePollingService,
} from '@muni-kypo-crp/sandbox-agenda/internal';
import { PoolResolver, PoolBreadcrumbResolver, PoolCommentResolver } from '@muni-kypo-crp/sandbox-agenda/resolvers';
import { PoolOverviewComponent } from './pool-overview.component';
import { AbstractPoolService } from '../services/abstract-pool/abstract-sandbox/abstract-pool.service';
import { AbstractPoolConcreteService } from '../services/abstract-pool/abstract-sandbox/abstract-pool-concrete.service';
import { PoolOverviewService } from '../services/state/pool-overview/pool-overview.service';
import { PoolOverviewConcreteService } from '../services/state/pool-overview/pool-overview-concrete.service';
import {
  SandboxAllocationUnitsConcreteService,
  SandboxAllocationUnitsService,
  SandboxInstanceService,
} from '@muni-kypo-crp/sandbox-agenda/pool-detail';
import { SandboxInstanceConcreteService } from '@muni-kypo-crp/sandbox-agenda/pool-detail';
import { MatTooltipModule } from '@angular/material/tooltip';
/**
 * Module containing components and providers for sandbox pool overview page
 */
@NgModule({
  declarations: [PoolOverviewComponent],
  imports: [CommonModule, SentinelTableModule, SentinelControlsComponent, MatDialogModule, MatTooltipModule],
  providers: [
    PoolResolver,
    PaginationService,
    PoolBreadcrumbResolver,
    PoolCommentResolver,
    SandboxAgendaContext,
    ResourcePollingService,
    { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
    { provide: PoolOverviewService, useClass: PoolOverviewConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
    { provide: SandboxAllocationUnitsService, useClass: SandboxAllocationUnitsConcreteService },
    { provide: AbstractPoolService, useClass: AbstractPoolConcreteService },
    { provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService },
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
