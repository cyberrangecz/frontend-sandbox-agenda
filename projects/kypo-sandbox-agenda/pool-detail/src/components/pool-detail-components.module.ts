import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import {
  SandboxInstanceResolver,
  SandboxInstanceBreadcrumbResolver,
  RequestResolver,
  RequestBreadcrumbResolver,
} from '@muni-kypo-crp/sandbox-agenda/resolvers';
import { PoolDetailMaterialModule } from './pool-detail-material.module';
import { PoolDetailComponent } from './pool-detail.component';
import { StageOverviewComponent } from './stage-overview/stage-overview.component';
/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [PoolDetailComponent, StageOverviewComponent],
  imports: [CommonModule, SentinelTableModule, PoolDetailMaterialModule, SentinelControlsModule],
  providers: [RequestResolver, RequestBreadcrumbResolver, SandboxInstanceResolver, SandboxInstanceBreadcrumbResolver],
})
export class PoolDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolDetailComponentsModule> {
    return {
      ngModule: PoolDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
