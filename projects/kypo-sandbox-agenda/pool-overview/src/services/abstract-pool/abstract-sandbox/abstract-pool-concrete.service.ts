import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OffsetPaginationEvent } from '@sentinel/common';
import { switchMap } from 'rxjs/operators';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { PoolOverviewService } from '../../state/pool-overview/pool-overview.service';
import { AbstractPoolService } from './abstract-pool.service';

@Injectable()
export class AbstractPoolConcreteService extends AbstractPoolService {
  private lastPagination: OffsetPaginationEvent;

  constructor(private poolOverviewService: PoolOverviewService) {
    super();
    this.pools$ = poolOverviewService.resource$;
    this.poolsHasError$ = poolOverviewService.hasError$;
  }

  /**
   * Gets all pools with passed pagination.
   * @param pagination requested pagination
   */
  getAll(pagination: OffsetPaginationEvent): Observable<any> {
    this.lastPagination = pagination;
    return this.poolOverviewService.getAll(pagination);
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
