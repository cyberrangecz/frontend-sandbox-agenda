import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@crczp/sandbox-agenda/topology';
import { SandboxDefinitionTopologyRoutingModule } from './sandbox-definition-topology-routing.module';
import { environment } from '../../../../environments/environment';

@NgModule({
    imports: [
        SandboxTopologyComponentsModule.forRoot(environment.sandboxAgendaConfig),
        SandboxDefinitionTopologyRoutingModule,
    ],
})
export class SandboxDefinitionTopologyModule {}
