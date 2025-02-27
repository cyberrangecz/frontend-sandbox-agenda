import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { SentinelAuthProviderListComponent } from '@sentinel/auth/components';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [SentinelAuthGuardWithLogin],
    },
    {
        path: 'sandbox-definition',
        loadChildren: () =>
            import('./lazy-loaded-modules/sandbox-definition/sandbox-definition-overview.module').then(
                (m) => m.SandboxDefinitionOverviewModule,
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
        path: 'images',
        loadChildren: () =>
            import('./lazy-loaded-modules/sandbox-images/sandbox-images.module').then(
                (m) => m.SandboxImagesOverviewModule,
            ),
        data: {
            breadcrumb: 'Images',
            title: 'Images Overview',
        },
    },
    {
        path: 'login',
        component: SentinelAuthProviderListComponent,
        canActivate: [SentinelNegativeAuthGuard],
    },
    {
        path: 'notifications',
        loadChildren: () =>
            import('./notifications/notifications-overview.module').then((m) => m.NotificationsOverviewModule),
        data: { breadcrumb: 'Notifications' },
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'logout-confirmed',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabledNonBlocking',
        } as ExtraOptions),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
