import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@crczp/sandbox-agenda/topology';
import { SandboxInstanceTopologyRoutingModule } from './sandbox-instance-topology-routing.module';
import { environment } from '../../../../../environments/environment';

@NgModule({
    imports: [
        SandboxTopologyComponentsModule.forRoot(environment.sandboxAgendaConfig),
        SandboxInstanceTopologyRoutingModule,
    ],
})
export class SandboxInstanceTopologyModule {}
