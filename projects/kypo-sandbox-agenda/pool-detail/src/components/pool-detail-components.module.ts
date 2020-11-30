import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaConfig } from '@kypo/sandbox-agenda';
import {
  SandboxInstanceResolver,
  SandboxInstanceBreadcrumbResolver,
  PoolResolver,
  RequestResolver,
  RequestBreadcrumbResolver,
} from '@kypo/sandbox-agenda/resolvers';
import { PoolDetailMaterialModule } from './pool-detail-material.module';
import { PoolDetailComponent } from './pool-detail.component';
/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [PoolDetailComponent],
  imports: [CommonModule, SentinelTableModule, PoolDetailMaterialModule, SentinelControlsModule],
  providers: [
    PoolResolver,
    RequestResolver,
    RequestBreadcrumbResolver,
    SandboxInstanceResolver,
    SandboxInstanceBreadcrumbResolver,
  ],
})
export class PoolDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolDetailComponentsModule> {
    return {
      ngModule: PoolDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
