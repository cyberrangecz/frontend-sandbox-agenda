import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolRequestDetailComponent } from '../../../../../../../kypo-sandbox-agenda/src/lib/components/pool-request/pool-request-detail.component';
import {
  POOL_DATA_ATTRIBUTE_NAME,
  POOL_REQUEST_DATA_ATTRIBUTE_NAME,
} from '../../../../../../../kypo-sandbox-agenda/src/lib/model/client/activated-route-data-attributes';
import { PoolRequestResolver } from '../../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/pool-request-resolver.service';
import { PoolResolver } from '../../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/pool-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PoolRequestDetailComponent,
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
