import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSandboxDefinitionComponent } from '../../../../../../kypo-sandbox-agenda/src/lib/components/sandbox-definition/edit/edit-sandbox-definition.component';

const routes: Routes = [
  {
    path: '',
    component: EditSandboxDefinitionComponent,
  },
];

/**
 * Create sandbox definition routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSandboxDefinitionRoutingModule {}
