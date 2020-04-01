import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PoolRequestDetailComponent, PoolRequestResolver, PoolRequestTypeResolver, PoolResolver} from 'kypo-sandbox-agenda';

const routes: Routes = [
  {
    path: '',
    component: PoolRequestDetailComponent,
    resolve: {
      pool: PoolResolver,
      poolRequest: PoolRequestResolver,
      poolRequestType: PoolRequestTypeResolver
    }
  }
  ];

/**
 * Routing module for sandbox request detail module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolRequestDetailRoutingModule {

}
