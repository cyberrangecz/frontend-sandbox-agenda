import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  KypoTopologyGraphConfig,
  KypoTopologyGraphModule,
  KypoTopologyLegendModule
} from '@muni-kypo-crp/topology-graph';
import { SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxTopologyComponent } from './sandbox-topology.component';

/**
 * Module containing components and providers for sandbox instance topology page
 */
@NgModule({
  declarations: [SandboxTopologyComponent],
  imports: [CommonModule, MatCardModule, KypoTopologyGraphModule, KypoTopologyLegendModule],
})
export class SandboxTopologyComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxTopologyComponentsModule> {
    return {
      ngModule: SandboxTopologyComponentsModule,
      providers: [
        { provide: KypoTopologyGraphConfig, useValue: config.kypoTopologyConfig },
        { provide: SandboxAgendaConfig, useValue: config },
      ],
    };
  }
}
