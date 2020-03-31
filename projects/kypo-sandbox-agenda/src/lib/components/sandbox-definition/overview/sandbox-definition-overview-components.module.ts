import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {Kypo2TableModule} from 'kypo2-table';
import {SandboxDefinitionOverviewService} from '../../../services/sandbox-definition/sandbox-definition-overview.service';
import {SandboxDefinitionOverviewConcreteService} from '../../../services/sandbox-definition/sandbox-definition-overview-concrete.service';
import {SandboxDefinitionDetailComponent} from './sandbox-definition-detail/sandbox-definition-detail.component';
import {SandboxDefinitionOverviewComponent} from './sandbox-definition-overview.component';
import {KypoControlsModule} from 'kypo-controls';
import {SandboxAgendaConfig} from '../../../model/sandbox-agenda-config';
import {SandboxNavigator} from '../../../services/client/sandbox-navigator.service';
import {SandboxDefaultNavigator} from '../../../services/client/sandbox-default-navigator.service';
import {KypoSandboxAgendaContext} from '../../../services/internal/sandox-agenda-context.service';

/**
 * Module containing components and services for sandbox definition overview page
 */
@NgModule({
  imports: [
    CommonModule,
    Kypo2TableModule,
    KypoControlsModule,
  ],
  declarations: [
    SandboxDefinitionOverviewComponent,
    SandboxDefinitionDetailComponent
  ],
  providers: [
    KypoSandboxAgendaContext,
    {provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService},
    {provide: SandboxNavigator, useClass: SandboxDefaultNavigator},
  ]
})

export class SandboxDefinitionOverviewComponentsModule {
  constructor(@Optional() @SkipSelf() parentModule: SandboxDefinitionOverviewComponentsModule) {
    if (parentModule) {
      throw new Error(
        'SandboxDefinitionOverviewComponentsModule is already loaded. Import it only once');
    }
  }

  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxDefinitionOverviewComponentsModule> {
    return {
      ngModule: SandboxDefinitionOverviewComponentsModule,
      providers: [
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
