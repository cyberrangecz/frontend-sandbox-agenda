import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxDefinitionOverviewComponent } from '../../../../../kypo-sandbox-agenda/src/lib/components/sandbox-definition/overview/sandbox-definition-overview.component';
import { SANDBOX_DEFINITION_NEW_PATH } from '../../../../../kypo-sandbox-agenda/src/lib/model/client/default-paths';

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
];

/**
 * Sandbox definition overview routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxDefinitionOverviewRoutingModule {}
