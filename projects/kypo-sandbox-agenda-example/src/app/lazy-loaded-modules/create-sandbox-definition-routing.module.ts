import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CreateSandboxDefinitionComponent} from 'kypo-sandbox-agenda';

const routes: Routes = [
  {
    path: '',
    component: CreateSandboxDefinitionComponent,
  },
];

/**
 * Create sandbox definition routing module
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CreateSandboxDefinitionRoutingModule {
}
