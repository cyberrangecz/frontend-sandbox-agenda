# CyberRangeᶜᶻ Platform Sandbox Agenda

Sandbox Agenda is a library containing components and services to manage sandbox definitions, pools, and sandbox instances.
It is developed as a frontend of [Sandbox service](https://github.com/cyberrangecz/backend-sandbox-service)

The library follows smart-dumb architecture. Smart components are exported from the library, and you can use them at your will. The project contains example implementation with lazy loading modules which you can use as an inspiration.
You can modify the behaviour of components by implementing abstract service class and injecting it through Angular dependency injection.

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

1. Run `npm install @cyberrangecz-platform/sandbox-agenda`
2. Install all peer dependencies
3. Create config class extending `SandboxAgendaConfig` from the library. Config contains following options:
    + pollingPeriod
    + defaultPaginationSize
    + topologyConfig
4. Import specific modules containing components (for example `SandboxDefinitionOverviewComponentsModule`) and provide config through `.forRoot()` method.
5. If you do not override the services, you will also need to provide API service. See [sandbox-api library]LINK-HERE().
6. You need to provide implementation of abstract services `SandboxErrorHandler` and `SandboxNotificationService` for error handling and notification displaying.
7. Optionally, you can override `SandboxNavigator` service to provide custom navigation if you do not want to use default routes.
8. Optionally, you can override and provide own implementation of services

For example, you would add `SandboxDefinitionOverviewComponent` like this:

1. Create feature module `SandboxDefinitionOverviewModule` containing all necessary imports and providers

```
@NgModule({
  imports: [
    CommonModule,
    SandboxDefinitionOverviewRoutingModule,
    SandboxDefinitionOverviewComponentsModule.forRoot(agendaConfig),
    SandboxApiModule.forRoot(apiConfig),
  ],
  providers: [
    { provide: SandboxErrorHandler, useClass: ClientErrorHandlerService },
    { provide: SandboxNotificationService, useClass: ClientNotificationService },
  ],
})
export class SandboxDefinitionOverviewModule {}
```

2. Create routing module importing the `SandboxDefinitionOverviewModule`

```
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
```

3. Lazy load the module in the parent routing module

```
  {
    path: SANDBOX_DEFINITION_PATH,
    loadChildren: () => import('./lazy-loaded-modules/sandbox-definition/sandbox-definition-overview.module).then((m) => m.SandboxDefinitionOverviewModule)
  }
```

## Running the demo app locally

To see the Sandbox agenda in action, you can use the demo app.

1. Pull and run the dependencies:
    + [Sandbox service](https://github.com/cyberrangecz/backend-sandbox-service)
    + [Training service](https://github.com/cyberrangecz/backend-training)
    + [Adaptive training service](https://github.com/cyberrangecz/backend-adaptive-training)
    + [User and group service](https://github.com/cyberrangecz/backend-user-and-group)
    + [Mitre techniques service](https://github.com/cyberrangecz/backend-mitre-technique-service)

    + Or alternatively, you can run the whole [deployment](https://github.com/cyberrangecz/devops-helm).
2. Configure [environment.local.ts](projects/sandbox-agenda-example-app/src/environments/environment.local.ts), pointing to the services.
3. Install dependencies by running `npm install`.
4. Run the project by running `npm run start`.
5. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files. The app will be running with a self-signed certificate, so you will need to accept the security exception in the browser.

