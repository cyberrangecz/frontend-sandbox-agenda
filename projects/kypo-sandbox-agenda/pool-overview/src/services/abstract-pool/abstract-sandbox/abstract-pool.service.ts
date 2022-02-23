import { IPaginatedElements, PaginatedResource, OffsetPaginationEvent, PaginationBaseEvent } from '@sentinel/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { HardwareUsage, Pool, SandboxDefinition } from '@muni-kypo-crp/sandbox-model';

export abstract class AbstractPoolService {
  protected limitsHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  limitsHasError$: Observable<boolean> = this.limitsHasErrorSubject$.asObservable();

  protected poolsHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  poolsHasError$: Observable<boolean> = this.poolsHasErrorSubject$.asObservable();

  protected sandboxDefinitionsHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  sandboxDefinitionsHasError$: Observable<boolean> = this.sandboxDefinitionsHasErrorSubject$.asObservable();

  protected limitsSubject$: BehaviorSubject<HardwareUsage>;

  limits$: Observable<HardwareUsage>;

  protected poolsSubject$: BehaviorSubject<PaginatedResource<Pool>>;

  pools$: Observable<PaginatedResource<Pool>>;

  protected sandboxDefinitionsSubject$: BehaviorSubject<IPaginatedElements<SandboxDefinition>>;

  sandboxDefinitions$: Observable<IPaginatedElements<SandboxDefinition>>;

  /**
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
}
