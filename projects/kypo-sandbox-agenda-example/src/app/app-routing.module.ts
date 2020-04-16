import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { Kypo2AuthGuardWithLogin, Kypo2AuthProviderPickerComponent, Kypo2NotAuthGuardService } from 'kypo2-auth';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [Kypo2AuthGuardWithLogin],
  },
  {
    path: 'sandbox-definition',
    loadChildren: () =>
      import('./lazy-loaded-modules/sandbox-definition/sandbox-definition-overview.module').then(
        (m) => m.SandboxDefinitionOverviewModule
      ),
    data: {
      breadcrumb: 'Definition',
      title: 'Sandbox Definition Overview',
    },
  },
  {
    path: 'pool',
    loadChildren: () =>
      import('./lazy-loaded-modules/pool/sandbox-pool-overview.module').then((m) => m.SandboxPoolOverviewModule),
    data: {
      breadcrumb: 'Pool',
      title: 'Pool Overview',
    },
  },
  {
    path: 'login',
    component: Kypo2AuthProviderPickerComponent,
    canActivate: [Kypo2NotAuthGuardService],
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications-overview.module').then((m) => m.NotificationsOverviewModule),
    data: { breadcrumb: 'Notifications' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [Kypo2AuthGuardWithLogin],
  },
  {
    path: 'logout-confirmed',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: true,
    } as ExtraOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
