// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Server url
export const baseURL = 'https://172.19.0.22';
// Frontend url
export const homeURL = 'https://localhost:4200';
export const sandboxesURL = baseURL + '/kypo-sandbox-service/api/v1/';
export const userAngGroupURL = baseURL + '/kypo-rest-user-and-group/api/v1/';

export const trainingURL = baseURL + '/kypo-rest-training/api/v1/';
export const adaptiveTrainingURL = baseURL + '/kypo-adaptive-training/api/v1/';
export const mitreTechniquesURL = baseURL + '/kypo-mitre-technique-service/api/v1/';

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

export const environment = {
  production: true,
  sandboxAgendaConfig: {
    pollingPeriod: 5000,
    retryAttempts: 3,
    defaultPaginationSize: 10,
    kypoTopologyConfig,
  },
  sandboxApiConfig: {
    sandboxRestBasePath: sandboxesURL,
  },
  trainingApiConfig: {
    trainingBasePath: trainingURL,
    adaptiveBasePath: adaptiveTrainingURL,
    mitreTechniqueBasePath: mitreTechniquesURL,
  },
  authConfig: {
    maxRetryAttempts: 3, // How many attempts to try to get user info from user and group service before emitting error
    guardMainPageRedirect: 'home', // Redirect from login page if user is logged in
    guardLoginPageRedirect: 'login', // Redirect to login page if user is not logged in
    tokenInterceptorAllowedUrls: [
      // all matching urls will have authorization token header
      baseURL,
    ],
    userInfoRestUri: userAngGroupURL,
    providers: [
      // OIDC providers
      {
        label: 'Login with local issuer',
        textColor: 'white',
        backgroundColor: '#002776',
        tokenRefreshTime: 30000, // how often check if tokens are still valid
        oidcConfig: {
          requireHttps: true,
          issuer: baseURL + '/keycloak/realms/KYPO',
          clientId: 'KYPO-client',
          redirectUri: homeURL,
          scope: 'openid email profile offline_access',
          logoutUrl: baseURL + '/keycloak/realms/KYPO/protocol/openid-connect/logout',
          silentRefreshRedirectUri: baseURL + '/silent-refresh.html',
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
