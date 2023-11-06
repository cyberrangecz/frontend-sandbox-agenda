import { NgModule } from '@angular/core';
import { SandboxTopologyComponentsModule } from '@muni-kypo-crp/sandbox-agenda/topology';
import { environmentLocal } from '../../../../environments/environment.local';
import { SandboxDefinitionTopologyRoutingModule } from './sandbox-definition-topology-routing.module';

@NgModule({
  imports: [
    SandboxTopologyComponentsModule.forRoot(environmentLocal.sandboxAgendaConfig),
    SandboxDefinitionTopologyRoutingModule,
  ],
})
export class SandboxDefinitionTopologyModule {}
