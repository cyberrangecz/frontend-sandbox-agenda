import { PaginatedResource, PaginationBaseEvent } from '@sentinel/common/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pool } from '@muni-kypo-crp/sandbox-model';

export abstract class AbstractPoolService {
  protected poolsHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  poolsHasError$: Observable<boolean> = this.poolsHasErrorSubject$.asObservable();

  protected poolsSubject$: BehaviorSubject<PaginatedResource<Pool>>;

  pools$: Observable<PaginatedResource<Pool>>;

  /**
   * Gets all pools with passed pagination.
   * @param pagination requested pagination
   */
  abstract getAll(pagination: PaginationBaseEvent): Observable<any>;

  /**
   * Deletes a pool
   * @param pool a pool to delete
   */
  abstract delete(pool: Pool): Observable<any>;

  /**
   * Allocates sandbox instances to a pool
   * @param pool a pool to be allocated
   * @param count number of sandbox instance to be allocated
   */
  abstract allocate(pool: Pool, count?: number): Observable<any>;

  /**
   * Clears a pool by deleting all sandbox instances
   * @param pool a pool to be cleared
   */
  abstract clear(pool: Pool): Observable<any>;

  abstract create(): Observable<any>;

  abstract lock(pool: Pool): Observable<any>;

  abstract unlock(pool: Pool): Observable<any>;

  abstract getSshAccess(poolId: number): Observable<boolean>;

  abstract updatePool(pool: Pool): Observable<any>;

  /**
   * Checks whether pool has a training instance associated
   * @param poolId id of the pool
   * @returns observable of boolean representing whether pool has training instances
   */
  abstract hasTrainingInstances(poolId: number): Observable<boolean>;
}
