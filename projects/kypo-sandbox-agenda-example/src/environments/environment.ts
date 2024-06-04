// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const baseURL = 'https://localhost:3000/';
export const homeURL = 'https://localhost:4200';
export const sandboxesURL = baseURL + 'kypo-sandbox-service/api/v1/';
export const authUrl = 'https://172.19.0.22';

export const kypoTopologyConfig = {
  topologyRestUrl: sandboxesURL,
  decoratorsRestUrl: '', // OBSOLETE
  defaultDecoratorRefreshPeriodInSeconds: 3, // OBSOLETE
  useRealTime: false, // OBSOLETE
  useDecorators: false, // OBSOLETE
  pollingPeriod: 5000,
  retryAttempts: 3,
  guacamoleConfig: {
    url: baseURL + '/guacamole/',
    username: 'guacuser',
    password: 'guacuser',
  },
};

export const environmentLocal = {
  production: false,
  sandboxAgendaConfig: {
    pollingPeriod: 10000,
    retryAttempts: 3,
    defaultPaginationSize: 10,
    kypoTopologyConfig,
  },
  sandboxApiConfig: {
    sandboxRestBasePath: sandboxesURL,
  },
  authConfig: {
    guardMainPageRedirect: 'home', // Redirect from login page if user is logged in
    guardLoginPageRedirect: 'login', // Redirect to login page if user is not logged in
    interceptorAllowedUrls: [baseURL],
    authorizationStrategyConfig: {
      authorizationUrl: baseURL + 'kypo-rest-user-and-group/api/v1/users/info',
    },
    providers: [
      {
        label: 'Login with local issuer',
        textColor: 'white',
        backgroundColor: '#002776',
        oidcConfig: {
          requireHttps: true,
          issuer: authUrl + '/keycloak/realms/KYPO',
          clientId: 'KYPO-client',
          redirectUri: homeURL,
          scope: 'openid email profile offline_access',
          logoutUrl: authUrl + '/keycloak/realms/KYPO/protocol/openid-connect/logout',
          silentRefreshRedirectUri: authUrl + '/silent-refresh.html',
          postLogoutRedirectUri: homeURL + '/logout-confirmed',
          clearHashAfterLogin: true,
        },
      },
    ],
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
