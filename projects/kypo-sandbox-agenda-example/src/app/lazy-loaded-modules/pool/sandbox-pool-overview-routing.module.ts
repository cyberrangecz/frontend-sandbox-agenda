import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolOverviewComponent } from '@muni-kypo-crp/sandbox-agenda/pool-overview';
import { SANDBOX_POOL_EDIT_PATH, SANDBOX_POOL_ID_SELECTOR, SANDBOX_POOL_NEW_PATH } from '@muni-kypo-crp/sandbox-agenda';
import { PoolBreadcrumbResolver, PoolResolver } from '@muni-kypo-crp/sandbox-agenda/resolvers';
import { Pool } from '@muni-kypo-crp/sandbox-model';

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
  {
    path: `:${SANDBOX_POOL_ID_SELECTOR}/${SANDBOX_POOL_EDIT_PATH}`,
    loadChildren: () => import('./edit/sandbox-pool-edit.module').then((m) => m.SandboxPoolEditModule),
    resolve: {
      breadcrumb: PoolBreadcrumbResolver,
      pool: PoolResolver,
    },
    data: {
      title: 'Edit Pool',
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
