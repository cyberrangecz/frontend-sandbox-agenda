import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxNavigator, SandboxDefaultNavigator, SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import {
  SandboxAgendaContext,
  SandboxDefinitionOverviewService,
  SandboxDefinitionOverviewConcreteService,
} from '@muni-kypo-crp/sandbox-agenda/internal';
import { SandboxDefinitionDetailComponent } from './sandbox-definition-detail/sandbox-definition-detail.component';
import { SandboxDefinitionOverviewComponent } from './sandbox-definition-overview.component';

/**
 * Module containing components and services for sandbox definition overview page
 */
@NgModule({
  imports: [CommonModule, SentinelTableModule, SentinelControlsModule],
  declarations: [SandboxDefinitionOverviewComponent, SandboxDefinitionDetailComponent],
  providers: [
    SandboxAgendaContext,
    { provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService },
    { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
  ],
})
export class SandboxDefinitionOverviewComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxDefinitionOverviewComponentsModule> {
    return {
      ngModule: SandboxDefinitionOverviewComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
