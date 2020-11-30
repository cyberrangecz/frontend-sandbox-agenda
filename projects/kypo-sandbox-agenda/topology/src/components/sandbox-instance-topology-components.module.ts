import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Kypo2TopologyGraphConfig, Kypo2TopologyGraphModule } from 'kypo2-topology-graph';
import { SandboxAgendaConfig } from '@kypo/sandbox-agenda';
import { SandboxInstanceTopologyComponent } from './sandbox-instance-topology.component';

/**
 * Module containing components and providers for sandbox instance topology page
 */
@NgModule({
  declarations: [SandboxInstanceTopologyComponent],
  imports: [CommonModule, MatCardModule, Kypo2TopologyGraphModule],
})
export class SandboxInstanceTopologyComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxInstanceTopologyComponentsModule> {
    return {
      ngModule: SandboxInstanceTopologyComponentsModule,
      providers: [
        { provide: Kypo2TopologyGraphConfig, useValue: config.kypo2TopologyConfig },
        { provide: SandboxAgendaConfig, useValue: config },
      ],
    };
  }
}
