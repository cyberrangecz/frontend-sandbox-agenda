import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxTopologyComponent } from '@muni-kypo-crp/sandbox-agenda/topology';
import { SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxInstanceResolver } from '@muni-kypo-crp/sandbox-agenda/resolvers';

const routes: Routes = [
  {
    path: '',
    component: SandboxTopologyComponent,
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
