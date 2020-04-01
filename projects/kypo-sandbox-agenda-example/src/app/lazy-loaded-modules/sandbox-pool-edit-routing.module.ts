import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SandboxPoolEditComponent} from '../../../../kypo-sandbox-agenda/src/lib/components/pool/edit/sandbox-pool-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SandboxPoolEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxPoolEditRoutingModule {

}
