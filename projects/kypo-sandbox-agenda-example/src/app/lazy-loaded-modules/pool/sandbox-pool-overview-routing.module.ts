import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolOverviewComponent } from 'kypo-sandbox-agenda/pool-overview';
import { SANDBOX_POOL_ID_SELECTOR, SANDBOX_POOL_NEW_PATH } from 'kypo-sandbox-agenda';
import { PoolBreadcrumbResolver } from 'kypo-sandbox-agenda/resolvers';

const routes: Routes = [
  {
    path: '',
    component: PoolOverviewComponent,
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
