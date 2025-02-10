import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  TopologyGraphConfig,
  TopologyGraphModule,
  TopologyLegendModule,
} from '@cyberrangecz-platform/topology-graph';
import { SandboxAgendaConfig } from '@cyberrangecz-platform/sandbox-agenda';
import { SandboxTopologyComponent } from './sandbox-topology.component';

/**
 * Module containing components and providers for sandbox instance topology page
 */
@NgModule({
  declarations: [SandboxTopologyComponent],
  imports: [CommonModule, MatCardModule, TopologyGraphModule, TopologyLegendModule],
})
export class SandboxTopologyComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxTopologyComponentsModule> {
    return {
      ngModule: SandboxTopologyComponentsModule,
      providers: [
        { provide: TopologyGraphConfig, useValue: config.topologyConfig },
        { provide: SandboxAgendaConfig, useValue: config },
      ],
    };
  }
}
