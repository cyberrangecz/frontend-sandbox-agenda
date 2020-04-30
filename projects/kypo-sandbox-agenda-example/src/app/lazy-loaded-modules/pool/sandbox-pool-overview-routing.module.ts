import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxPoolOverviewComponent } from '../../../../../kypo-sandbox-agenda/src/lib/components/pool/overview/sandbox-pool-overview.component';
import {
  SANDBOX_POOL_ID_SELECTOR,
  SANDBOX_POOL_NEW_PATH,
} from '../../../../../kypo-sandbox-agenda/src/lib/model/client/default-paths';
import { PoolBreadcrumbResolver } from '../../../../../kypo-sandbox-agenda/src/lib/services/resolvers/pool-breadcrumb-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SandboxPoolOverviewComponent,
  },
  {
    path: SANDBOX_POOL_NEW_PATH,
    loadChildren: () => import('./edit/sandbox-pool-edit.module').then((m) => m.SandboxPoolEditModule),
    resolve: {
      breadcrumb: PoolBreadcrumbResolver,
    },
    data: {
      title: 'Create Pool',
    },
  },
  {
    path: `:${SANDBOX_POOL_ID_SELECTOR}`,
    loadChildren: () => import('./detail/sandbox-pool-detail.module').then((m) => m.SandboxPoolDetailModule),
    resolve: {
      breadcrumb: PoolBreadcrumbResolver,
    },
    data: {
      title: 'Pool Detail',
    },
  },
];

/**
 * Routing module for sandbox pool overview
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxPoolOverviewRoutingModule {}
