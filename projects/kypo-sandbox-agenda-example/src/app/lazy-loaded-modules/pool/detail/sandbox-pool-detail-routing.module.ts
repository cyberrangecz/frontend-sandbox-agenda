import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxPoolDetailComponent } from '../../../../../../kypo-sandbox-agenda/src/lib/components/pool/detail/sandbox-pool-detail.component';
import { POOL_DATA_ATTRIBUTE_NAME } from '../../../../../../kypo-sandbox-agenda/src/lib/model/client/activated-route-data-attributes';
import {
  POOL_ALLOCATION_REQUEST_PATH,
  POOL_CLEANUP_REQUEST_PATH,
  POOL_REQUEST_ID_SELECTOR,
  SANDBOX_ALLOCATION_UNIT_ID_SELECTOR,
  SANDBOX_ALLOCATION_UNIT_PATH,
  SANDBOX_INSTANCE_ID_SELECTOR,
  SANDBOX_INSTANCE_PATH,
  SANDBOX_INSTANCE_TOPOLOGY_PATH,
} from '../../../../../../kypo-sandbox-agenda/src/lib/model/client/default-paths';
import { PoolRequestBreadcrumbResolver } from '../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/pool-request-breadcrumb-resolver.service';
import { PoolResolver } from '../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/pool-resolver.service';
import { SandboxInstanceBreadcrumbResolver } from '../../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/sandbox-instance-breadcrumb-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SandboxPoolDetailComponent,
    resolve: {
      [POOL_DATA_ATTRIBUTE_NAME]: PoolResolver,
    },
  },
  {
    path: `${SANDBOX_INSTANCE_PATH}/:${SANDBOX_INSTANCE_ID_SELECTOR}/${SANDBOX_INSTANCE_TOPOLOGY_PATH}`,
    loadChildren: () =>
      import('./sandbox-instance/sandbox-instance-topology.module').then((m) => m.SandboxInstanceTopologyModule),
    resolve: {
      breadcrumb: SandboxInstanceBreadcrumbResolver,
    },
    data: {
      title: 'Sandbox Topology',
    },
  },
  {
    path:
      `${SANDBOX_ALLOCATION_UNIT_PATH}/:${SANDBOX_ALLOCATION_UNIT_ID_SELECTOR}/${POOL_ALLOCATION_REQUEST_PATH}` +
      `/:${POOL_REQUEST_ID_SELECTOR}`,
    loadChildren: () =>
      import('./request/pool-allocation-request-detail.module').then((m) => m.PoolAllocationRequestDetailModule),
    resolve: {
      breadcrumb: PoolRequestBreadcrumbResolver,
    },
    data: {
      title: 'Allocation Request Stages',
    },
  },
  {
    path:
      `${SANDBOX_ALLOCATION_UNIT_PATH}/:${SANDBOX_ALLOCATION_UNIT_ID_SELECTOR}/${POOL_CLEANUP_REQUEST_PATH}` +
      `/:${POOL_REQUEST_ID_SELECTOR}`,
    loadChildren: () =>
      import('./request/pool-cleanup-request-detail.module').then((m) => m.PoolCleanupRequestDetailModule),
    resolve: {
      breadcrumb: PoolRequestBreadcrumbResolver,
    },
    data: {
      title: 'Cleanup Request Stages',
    },
  },
];

/**
 * Routing for pool detail module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxPoolDetailRoutingModule {}
