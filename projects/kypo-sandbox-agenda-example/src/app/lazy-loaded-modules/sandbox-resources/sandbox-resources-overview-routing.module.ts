import { SandboxResourcesComponent } from '../../../../../kypo-sandbox-agenda/sandbox-resources/src/components/sandbox-resources.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SandboxResourcesComponent,
  },
];

/**
 * Sandbox definition overview routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxResourcesOverviewRoutingModule {}
