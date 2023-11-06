import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@muni-kypo-crp/sandbox-agenda/topology';
import { environmentLocal } from '../../../../../environments/environment.local';
import { SandboxInstanceTopologyRoutingModule } from './sandbox-instance-topology-routing.module';

@NgModule({
  imports: [
    SandboxTopologyComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxInstanceTopologyRoutingModule,
  ],
})
export class SandboxInstanceTopologyModule {}
