import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxNavigator, SandboxDefaultNavigator, SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import {
  PaginationService,
  SandboxAgendaContext,
  SandboxDefinitionOverviewService,
  SandboxDefinitionOverviewConcreteService,
} from '@muni-kypo-crp/sandbox-agenda/internal';
import { SandboxDefinitionDetailComponent } from './sandbox-definition-detail/sandbox-definition-detail.component';
import { SandboxDefinitionOverviewComponent } from './sandbox-definition-overview.component';
import {
  SandboxDefinitionBreadcrumbResolver,
  SandboxDefinitionResolver,
} from '@muni-kypo-crp/sandbox-agenda/resolvers';

/**
 * Module containing components and services for sandbox definition overview page
 */
@NgModule({
  imports: [CommonModule, SentinelTableModule, SentinelControlsComponent],
  declarations: [SandboxDefinitionOverviewComponent, SandboxDefinitionDetailComponent],
  providers: [
    PaginationService,
    SandboxAgendaContext,
    SandboxDefinitionResolver,
    SandboxDefinitionBreadcrumbResolver,
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
