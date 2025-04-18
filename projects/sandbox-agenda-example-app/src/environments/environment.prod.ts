// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// OIDC url
const OIDC_URL = 'https://172.19.0.22';
// backend url
const API_URL = 'https://172.19.0.22';
// frontend home url
const HOME_URL = 'https://localhost:4200';

export const topologyConfig = {
    topologyRestUrl: API_URL + '/sandbox-service/api/v1/',
    decoratorsRestUrl: '', // OBSOLETE
    defaultDecoratorRefreshPeriodInSeconds: 3, // OBSOLETE
    useRealTime: false, // OBSOLETE
    useDecorators: false, // OBSOLETE
    pollingPeriod: 5000,
    retryAttempts: 3,
    guacamoleConfig: {
        url: API_URL + '/guacamole/',
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
        topologyConfig,
    },
    sandboxApiConfig: {
        sandboxRestBasePath: API_URL + '/sandbox-service/api/v1/',
    },
    trainingApiConfig: {
        trainingBasePath: API_URL + '/training/api/v1/',
        adaptiveBasePath: API_URL + '/adaptive-training/api/v1/',
        mitreTechniqueBasePath: API_URL + '/mitre-technique-service/api/v1/',
    },
    authConfig: {
        maxRetryAttempts: 3, // How many attempts to try to get user info from user and group service before emitting error
        guardMainPageRedirect: 'home', // Redirect from login page if user is logged in
        guardLoginPageRedirect: 'login', // Redirect to login page if user is not logged in
        tokenInterceptorAllowedUrls: [OIDC_URL, API_URL],
        userInfoRestUri: API_URL + '/user-and-group/api/v1/',
        providers: [
            {
                label: 'Login with local Keycloak',
                textColor: 'white',
                backgroundColor: '#1e2173',
                oidcConfig: {
                    requireHttps: true,
                    clearHashAfterLogin: true,
                    issuer: OIDC_URL + '/keycloak/realms/CRCZP',
                    clientId: 'CRCZP-client',
                    redirectUri: HOME_URL,
                    scope: 'openid email profile offline_access',
                    logoutUrl: OIDC_URL + '/keycloak/realms/CRCZP/protocol/openid-connect/logout',
                    silentRefreshRedirectUri: HOME_URL + '/silent-refresh.html',
                    postLogoutRedirectUri: HOME_URL + '/logout-confirmed',
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
