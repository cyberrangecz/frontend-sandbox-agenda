import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxDefinitionOverviewComponent } from '@cyberrangecz-platform/sandbox-agenda/sandbox-definition-overview';
import {
  SANDBOX_DEFINITION_ID_SELECTOR,
  SANDBOX_DEFINITION_NEW_PATH,
  SANDBOX_TOPOLOGY_PATH,
} from '@cyberrangecz-platform/sandbox-agenda';
import { SandboxDefinitionBreadcrumbResolver } from '@cyberrangecz-platform/sandbox-agenda/resolvers';

const routes: Routes = [
  {
    path: '',
    component: SandboxDefinitionOverviewComponent,
  },
  {
    path: SANDBOX_DEFINITION_NEW_PATH,
    loadChildren: () => import('./edit/edit-sandbox-definition.module').then((m) => m.EditSandboxDefinitionModule),
    data: {
      breadcrumb: 'Create',
      title: 'Create Sandbox Definition',
    },
  },
  {
    path: `:${SANDBOX_DEFINITION_ID_SELECTOR}/${SANDBOX_TOPOLOGY_PATH}`,
    loadChildren: () =>
      import('./topology/sandbox-definition-topology.module').then((m) => m.SandboxDefinitionTopologyModule),
    resolve: {
      breadcrumb: SandboxDefinitionBreadcrumbResolver,
    },
    data: {
      title: 'Sandbox Definition Topology',
    },
  },
];

/**
 * Sandbox definition overview routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxDefinitionOverviewRoutingModule {}
