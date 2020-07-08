import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { SandboxDefaultNavigator } from '../../../services/client/sandbox-default-navigator.service';
import { SandboxNavigator } from '../../../services/client/sandbox-navigator.service';
import { SandboxAgendaContext } from '../../../services/internal/sandox-agenda-context.service';
import { SandboxDefinitionOverviewConcreteService } from '../../../services/sandbox-definition/sandbox-definition-overview-concrete.service';
import { SandboxDefinitionOverviewService } from '../../../services/sandbox-definition/sandbox-definition-overview.service';
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
