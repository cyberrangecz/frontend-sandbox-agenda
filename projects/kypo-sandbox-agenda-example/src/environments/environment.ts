// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Server url
export const baseURL = 'https://172.19.0.22/';
// Frontend url
export const homeURL = 'https://localhost:4200';
export const sandboxesURL = baseURL + 'kypo-sandbox-service/api/v1/';

export const kypoTopologyConfig = {
  topologyRestUrl: sandboxesURL,
  decoratorsRestUrl: '', // OBSOLETE
  defaultDecoratorRefreshPeriodInSeconds: 3, // OBSOLETE
  useRealTime: false, // OBSOLETE
  useDecorators: false, // OBSOLETE
  guacamoleConfig: {
    url: baseURL + '/guacamole/',
    username: 'guacuser',
    password: 'guacuser',
  },
};

export const environment = {
  production: false,
  sandboxAgendaConfig: {
    pollingPeriod: 10000,
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
          issuer: 'https://172.19.0.22:443/csirtmu-dummy-issuer-server/',
          clientId: 'bxPXhdWNeqhWssxbSGiRjQbnQqmqxDdiTTDJ',
          redirectUri: homeURL, // redirect after successful login
          scope: 'openid email profile',
          logoutUrl: 'https://172.19.0.22/csirtmu-dummy-issuer-server/endsession/endsession',
          postLogoutRedirectUri: homeURL + '/logout-confirmed/',
          silentRefreshRedirectUri: homeURL + '/silent-refresh.html',
          clearHashAfterLogin: true, // remove token and other info from url after login
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
