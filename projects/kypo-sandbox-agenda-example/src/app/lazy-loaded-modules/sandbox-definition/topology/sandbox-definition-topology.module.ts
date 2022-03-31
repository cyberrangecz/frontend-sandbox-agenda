import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@muni-kypo-crp/sandbox-agenda/topology';
import { environment } from '../../../../environments/environment';
import { SandboxDefinitionTopologyRoutingModule } from './sandbox-definition-topology-routing.module';

@NgModule({
  imports: [
    SandboxTopologyComponentsModule.forRoot(environment.sandboxAgendaConfig),
    SandboxDefinitionTopologyRoutingModule,
  ],
})
export class SandboxDefinitionTopologyModule {}
