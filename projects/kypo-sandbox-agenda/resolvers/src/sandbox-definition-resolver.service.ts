import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { SandboxDefinitionApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SANDBOX_DEFINITION_ID_SELECTOR } from '@muni-kypo-crp/sandbox-agenda';
/**
 * Router data provider
 */
@Injectable()
export class SandboxDefinitionResolver implements Resolve<SandboxDefinition> {
  constructor(
    private api: SandboxDefinitionApi,
    private errorHandler: SandboxErrorHandler,
    private navigator: SandboxNavigator,
    private router: Router,
  ) {}

  /**
   * Retrieves a specific resource based on id provided in url. Navigates to a resource overview if no resource with such id exists.
   * @param route route snapshot
   */
  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<SandboxDefinition> | Promise<SandboxDefinition> | SandboxDefinition {
    if (!route.paramMap.has(SANDBOX_DEFINITION_ID_SELECTOR)) {
      return this.navigateToSandboxDefinitionOverview();
    }
    const sandboxDefinitionId = Number(route.paramMap.get(SANDBOX_DEFINITION_ID_SELECTOR));

    return this.api.get(sandboxDefinitionId).pipe(
      take(1),
      mergeMap((sandboxDefinition) =>
        sandboxDefinition ? of(sandboxDefinition) : this.navigateToSandboxDefinitionOverview(),
      ),
      catchError((err) => {
        this.errorHandler.emit(err, 'Sandbox definition resolver');
        this.navigateToSandboxDefinitionOverview();
        return EMPTY;
      }),
    );
  }

  private navigateToSandboxDefinitionOverview(): Observable<never> {
    this.router.navigate([this.navigator.toSandboxDefinitionOverview()]);
    return EMPTY;
  }
}
