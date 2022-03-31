import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@muni-kypo-crp/sandbox-agenda/topology';
import { environment } from '../../../../../environments/environment';
import { SandboxInstanceTopologyRoutingModule } from './sandbox-instance-topology-routing.module';

@NgModule({
  imports: [
    SandboxTopologyComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxInstanceTopologyRoutingModule,
  ],
})
export class SandboxInstanceTopologyModule {}
