import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {Kypo2TableModule} from 'kypo2-table';
import {SandboxPoolOverviewComponent} from './sandbox-pool-overview.component';
import {KypoControlsModule} from 'kypo-controls';
import {PoolBreadcrumbResolver} from '../../../services/resolvers/pool-breadcrumb-resolver.service';
import {PoolResolver} from '../../../services/resolvers/pool-resolver.service';
import {PoolOverviewService} from '../../../services/pool/pool-overview.service';
import {PoolOverviewConcreteService} from '../../../services/pool/pool-overview-concrete.service';
import {SandboxAgendaConfig} from '../../../model/client/sandbox-agenda-config';
import {SandboxNavigator} from '../../../services/client/sandbox-navigator.service';
import {SandboxDefaultNavigator} from '../../../services/client/sandbox-default-navigator.service';
import {SandboxAgendaContext} from '../../../services/internal/sandox-agenda-context.service';

/**
 * Module containing components and providers for sandbox pool overview page
 */
@NgModule({
  declarations: [SandboxPoolOverviewComponent],
    imports: [
      CommonModule,
      Kypo2TableModule,
      KypoControlsModule
    ],
  providers: [
    PoolResolver,
    PoolBreadcrumbResolver,
    SandboxAgendaContext,
    {provide: SandboxNavigator, useClass: SandboxDefaultNavigator},
    {provide: PoolOverviewService, useClass: PoolOverviewConcreteService}
  ]
})
export class SandboxPoolOverviewComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxPoolOverviewComponentsModule> {
    return {
      ngModule: SandboxPoolOverviewComponentsModule,
      providers: [
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
