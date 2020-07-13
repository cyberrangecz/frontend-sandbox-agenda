import { NgModule } from '@angular/core';
import { SandboxInstanceTopologyComponentsModule } from 'kypo-sandbox-agenda/topology';
import { environment } from '../../../../../environments/environment';
import { SandboxInstanceTopologyRoutingModule } from './sandbox-instance-topology-routing.module';

@NgModule({
  imports: [
    SandboxInstanceTopologyComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxInstanceTopologyRoutingModule,
  ],
})
export class SandboxInstanceTopologyModule {}
