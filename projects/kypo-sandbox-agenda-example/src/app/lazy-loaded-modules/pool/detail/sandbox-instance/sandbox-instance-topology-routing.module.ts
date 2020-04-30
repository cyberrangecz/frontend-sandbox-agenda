import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxInstanceTopologyComponent } from '../../../../../../../kypo-sandbox-agenda/src/lib/components/sandbox-instance/topology/sandbox-instance-topology.component';
import { SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME } from '../../../../../../../kypo-sandbox-agenda/src/lib/model/client/activated-route-data-attributes';
import { SandboxInstanceResolver } from '../../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/sandbox-instance-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SandboxInstanceTopologyComponent,
    resolve: {
      [SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME]: SandboxInstanceResolver,
    },
  },
];

/**
 * Routing module for sandbox instance topology module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxInstanceTopologyRoutingModule {}
