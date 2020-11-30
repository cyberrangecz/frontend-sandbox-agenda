import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { PoolApi } from 'kypo-sandbox-api';
import { Pool } from 'kypo-sandbox-model';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import {
  SandboxErrorHandler,
  SandboxNavigator,
  SANDBOX_POOL_ID_SELECTOR,
  SANDBOX_POOL_NEW_PATH,
  SANDBOX_POOL_PATH,
} from '@kypo/sandbox-agenda';

/**
 * Router data provider
 */
@Injectable()
export class PoolResolver implements Resolve<Pool> {
  constructor(
    private api: PoolApi,
    private errorHandler: SandboxErrorHandler,
    private navigator: SandboxNavigator,
    private router: Router
  ) {}

  /**
   * Retrieves a specific resource based on id provided in url. Navigates to a resource overview if no resource with such id exists.
   * @param route route snapshot
   * @param state router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pool> | Promise<Pool> | Pool {
    if (state.url.endsWith(`${SANDBOX_POOL_PATH}/${SANDBOX_POOL_NEW_PATH}`)) {
      return null;
    }
    if (route.paramMap.has(SANDBOX_POOL_ID_SELECTOR)) {
      const id = Number(route.paramMap.get(SANDBOX_POOL_ID_SELECTOR));
      return this.api.getPool(id).pipe(
        take(1),
        mergeMap((pool) => (pool ? of(pool) : this.navigateToOverview())),
        catchError((err) => {
          this.errorHandler.emit(err, 'Sandbox pool resolver');
          this.navigateToOverview();
          return EMPTY;
        })
      );
    }
    return this.navigateToOverview();
  }

  private navigateToOverview(): Observable<never> {
    this.router.navigate([this.navigator.toPoolOverview()]);
    return EMPTY;
  }
}
