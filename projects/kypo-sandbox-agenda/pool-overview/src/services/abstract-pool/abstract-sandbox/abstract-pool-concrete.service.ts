import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { RequestedPagination } from '@sentinel/common';
import { switchMap } from 'rxjs/operators';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { PoolOverviewService } from '../../state/pool-overview/pool-overview.service';
import { AbstractPoolService } from './abstract-pool.service';
import { SandboxLimitsService } from '../../state/resources/sandbox-resources.service';
import { SandboxDefinitionOverviewService } from '@muni-kypo-crp/sandbox-agenda/internal';

@Injectable()
export class AbstractPoolConcreteService extends AbstractPoolService {
  private lastPagination: RequestedPagination;

  constructor(
    private poolOverviewService: PoolOverviewService,
    private sandboxLimitsService: SandboxLimitsService,
    private sandboxDefinitionService: SandboxDefinitionOverviewService
  ) {
    super();
    this.pools$ = poolOverviewService.resource$;
    this.limits$ = sandboxLimitsService.limits$;
    this.sandboxDefinitions$ = sandboxDefinitionService.resource$;
    this.poolsHasError$ = poolOverviewService.hasError$;
  }

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  getAll(pagination: RequestedPagination): Observable<any> {
    this.lastPagination = pagination;
    return combineLatest([
      this.poolOverviewService.getAll(pagination),
      this.sandboxLimitsService.getLimits(),
      this.sandboxDefinitionService.getAll(pagination),
    ]);
  }

  /**
   * Starts a sandbox instance allocation, informs about the result and updates list of pools or handles an error
   * @param pool a pool to be allocated with sandbox instances
   * @param count number of sandbox instances to be allocated
   */
  allocate(pool: Pool, count = -1): Observable<any> {
    return this.poolOverviewService.allocate(pool, count).pipe(switchMap(() => this.getAll(this.lastPagination)));
  }

  /**
   * Deletes a pool, informs about the result and updates list of pools or handles an error
   * @param pool a pool to be deleted
   */
  delete(pool: Pool): Observable<any> {
    return this.poolOverviewService.delete(pool).pipe(switchMap(() => this.getAll(this.lastPagination)));
  }

  /**
   * Clears a pool by deleting all associated sandbox instances, informs about the result and updates list of pools or handles an error
   * @param pool a pool to be cleared
   */
  clear(pool: Pool): Observable<any> {
    return this.poolOverviewService.clear(pool).pipe(switchMap(() => this.getAll(this.lastPagination)));
  }

  create(): Observable<any> {
    return this.poolOverviewService.create().pipe(switchMap(() => this.getAll(this.lastPagination)));
  }

  lock(pool: Pool): Observable<any> {
    return this.poolOverviewService.lock(pool).pipe(switchMap(() => this.getAll(this.lastPagination)));
  }

  getSshAccess(poolId: number): Observable<boolean> {
    return this.poolOverviewService.getSshAccess(poolId);
  }

  unlock(pool: Pool): Observable<any> {
    return this.poolOverviewService.unlock(pool).pipe(switchMap(() => this.getAll(this.lastPagination)));
  }
}
