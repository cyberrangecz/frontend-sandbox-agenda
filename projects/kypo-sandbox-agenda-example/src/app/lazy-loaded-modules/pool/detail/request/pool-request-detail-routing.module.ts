import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestDetailComponent } from 'kypo-sandbox-agenda/request-detail';
import { POOL_DATA_ATTRIBUTE_NAME, POOL_REQUEST_DATA_ATTRIBUTE_NAME } from 'kypo-sandbox-agenda';
import { PoolRequestResolver, PoolResolver } from 'kypo-sandbox-agenda/resolvers';

const routes: Routes = [
  {
    path: '',
    component: RequestDetailComponent,
    resolve: {
      [POOL_DATA_ATTRIBUTE_NAME]: PoolResolver,
      [POOL_REQUEST_DATA_ATTRIBUTE_NAME]: PoolRequestResolver,
    },
  },
];

/**
 * Routing module for sandbox request detail module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolRequestDetailRoutingModule {}
