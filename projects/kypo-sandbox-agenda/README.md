# KYPO Sandbox Agenda

KYPO Sandbox Agenda is a library containing components and services to manage sandbox definitions, pools, and sandbox instances.
It is developed as a frontend of [KYPO Sandbox service](https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-sandbox-service)

The library follows smart-dumb architecture. Smart components are exported from the library, and you can use them at your will. The project contains example implementation with lazy loading modules which you can use as an inspiration.
You can modify the behaviour of components by implementing abstract service class and injecting it through Angular dependency injection.

## Prerequisites

To use the library you need to have installed:

* NPM with private [KYPO Nexus repository](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
* Angular 9+
* Angular Material 9+

## Features

* Components and services for managing sandbox definitions
* Components and services for managing pools
* Components and services for managing sandbox instances
* Components and services for managing sandbox allocation and allocation stages
* Default routing (overridable)
* Errors, notifications, and navigation services
* CanDeactivate interface on all main components
* Resolvers for all main components

## Usage

To use the sandbox agenda in your Angular application follow these steps:

1. Run `npm install kypo-sandbox-agenda`
1. Install all peer dependencies
1. Create config class extending `SandboxAgendaConfig` from the library. Config contains following options:
    + pollingPeriod
    + defaultPaginationSize
    + kypoTopologyConfig
1. Import specific modules containing components (for example `SandboxDefinitionOverviewComponentsModule`) and provide config through `.forRoot()` method.
1. If you do not override the services, you will also need to provide API service. See [kypo-sandbox-api library](https://gitlab.ics.muni.cz/kypo-crp/frontend-angular/apis/kypo-sandbox-api).
1. You need to provide implementation of abstract services `SandboxErrorHandler` and `SandboxNotificationService` for error handling and notification displaying.
1. Optionally, you can override `SandboxNavigator` service to provide custom navigation if you do not want to use default routes.
1. Optionally, cou can override and provide own implementation of services

For example, you would add `SandboxDefinitionOverviewComponent` like this:

1. Create feature module `SandboxDefinitionOverviewModule` containing all necessary imports and providers

``
@NgModule({
  imports: [
    CommonModule,
    SandboxDefinitionOverviewRoutingModule,
    SandboxDefinitionOverviewComponentsModule.forRoot(agendaConfig),
    KypoSandboxApiModule.forRoot(apiConfig),
  ],
  providers: [
    { provide: SandboxErrorHandler, useClass: ClientErrorHandlerService },
    { provide: SandboxNotificationService, useClass: ClientNotificationService },
  ],
})
export class SandboxDefinitionOverviewModule {}
``

1. Create routing module importing the `SandboxDefinitionOverviewModule`

``
const routes: Routes = [
  {
    path: '',
    component: SandboxDefinitionOverviewComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SandboxDefinitionOverviewRoutingModule {}
``

1. Lazy load the module in the parent routing module

``
  {
    path: SANDBOX_DEFINITION_PATH,
    loadChildren: () => import('./lazy-loaded-modules/sandbox-definition/sandbox-definition-overview.module).then((m) => m.SandboxDefinitionOverviewModule)
  }
``

## Example

To see the library in work and to see example setup, you can run the example app.
To run the example you need to run [KYPO Sandbox service](https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-sandbox-service) or have access to a running instance and provide the URL to the service in when importing API module.

1. Clone this repository
1. Run `npm install`
1. Run `ng serve --ssl`
1. See the app at `https://localhost:4200`
