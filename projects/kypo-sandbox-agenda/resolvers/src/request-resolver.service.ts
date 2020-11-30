import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Request } from 'kypo-sandbox-model';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import {
  POOL_ALLOCATION_REQUEST_PATH,
  POOL_REQUEST_ID_SELECTOR,
  SANDBOX_POOL_ID_SELECTOR,
  SandboxErrorHandler,
  SandboxNavigator,
} from '@kypo/sandbox-agenda';
import { AllocationRequestsApi, CleanupRequestsApi } from 'kypo-sandbox-api';

/**
 * Router data provider
 */
@Injectable()
export class RequestResolver implements Resolve<Request> {
  constructor(
    private allocationRequestApi: AllocationRequestsApi,
    private cleanupRequestApi: CleanupRequestsApi,
    private errorHandler: SandboxErrorHandler,
    private navigator: SandboxNavigator,
    private router: Router
  ) {}

  /**
   * Retrieves a specific resource based on id provided in url. Navigates to a resource overview if no resource with such id exists.
   * @param route route snapshot
   * @param state router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Request> | Promise<Request> | Request {
    if (!route.paramMap.has(SANDBOX_POOL_ID_SELECTOR)) {
      return this.navigateToPoolOverview();
    }

    const poolId = Number(route.paramMap.get(SANDBOX_POOL_ID_SELECTOR));

    if (!route.paramMap.has(POOL_REQUEST_ID_SELECTOR)) {
      return this.navigateToPool(poolId);
    }

    const requestId = Number(route.paramMap.get(POOL_REQUEST_ID_SELECTOR));

    let request$: Observable<Request>;
    request$ = state.url.includes(POOL_ALLOCATION_REQUEST_PATH)
      ? this.allocationRequestApi.get(requestId)
      : this.cleanupRequestApi.get(requestId);

    return request$.pipe(
      take(1),
      mergeMap((request) => (request ? of(request) : this.navigateToPool(poolId))),
      catchError((err) => {
        this.errorHandler.emit(err, 'Pool request resolver');
        this.navigateToPool(poolId);
        return EMPTY;
      })
    );
  }

  private navigateToPool(poolId: number): Observable<never> {
    this.router.navigate([this.navigator.toPool(poolId)]);
    return EMPTY;
  }

  private navigateToPoolOverview(): Observable<never> {
    this.router.navigate([this.navigator.toPoolOverview()]);
    return EMPTY;
  }
}
