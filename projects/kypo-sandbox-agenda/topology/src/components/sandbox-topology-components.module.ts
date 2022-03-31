import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  Kypo2TopologyGraphConfig,
  Kypo2TopologyGraphModule,
  Kypo2TopologyLegendModule,
  TopologyApiModule,
} from '@muni-kypo-crp/topology-graph';
import { SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxTopologyComponent } from './sandbox-topology.component';

/**
 * Module containing components and providers for sandbox instance topology page
 */
@NgModule({
  declarations: [SandboxTopologyComponent],
  imports: [CommonModule, MatCardModule, Kypo2TopologyGraphModule, Kypo2TopologyLegendModule, TopologyApiModule],
})
export class SandboxTopologyComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxTopologyComponentsModule> {
    return {
      ngModule: SandboxTopologyComponentsModule,
      providers: [
        { provide: Kypo2TopologyGraphConfig, useValue: config.kypo2TopologyConfig },
        { provide: SandboxAgendaConfig, useValue: config },
        TopologyApiModule.forRoot(config.kypo2TopologyConfig).providers,
      ],
    };
  }
}
