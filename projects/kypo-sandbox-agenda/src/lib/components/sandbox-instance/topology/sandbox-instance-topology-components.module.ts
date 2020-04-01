import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Kypo2TopologyGraphModule} from 'kypo2-topology-graph';
import {SandboxInstanceTopologyComponent} from './sandbox-instance-topology.component';
import {MatCardModule} from '@angular/material/card';
import {SandboxInstanceResolver} from '../../../services/resolvers/sandbox-instance-resolver.service';
import {SandboxAgendaConfig} from '../../../model/client/sandbox-agenda-config';


/**
 * Module containing components and providers for sandbox instance topology page
 */
@NgModule({
  declarations: [SandboxInstanceTopologyComponent],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  providers: [
    SandboxInstanceResolver,
  ]
})
export class SandboxInstanceTopologyComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxInstanceTopologyComponentsModule> {
    return {
      ngModule: SandboxInstanceTopologyComponentsModule,
      providers: [
        Kypo2TopologyGraphModule.forRoot(config.kypo2TopologyConfig).providers,
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
