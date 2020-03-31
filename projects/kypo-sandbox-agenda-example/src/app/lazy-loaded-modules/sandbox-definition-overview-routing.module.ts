import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SANDBOX_DEFINITION_NEW_PATH, SandboxDefinitionOverviewComponent} from 'kypo-sandbox-agenda';

const routes: Routes = [
  {
    path: '',
    component: SandboxDefinitionOverviewComponent,
  },
  {
    path: SANDBOX_DEFINITION_NEW_PATH,
    loadChildren: () => import('./create-sandbox-definition.module').then(m => m.CreateSandboxDefinitionModule),
    data: {
      breadcrumb: 'Create',
      title: 'Create Sandbox Definition'
    }
  },
];

/**
 * Sandbox definition overview routing
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class SandboxDefinitionOverviewRoutingModule {

}
