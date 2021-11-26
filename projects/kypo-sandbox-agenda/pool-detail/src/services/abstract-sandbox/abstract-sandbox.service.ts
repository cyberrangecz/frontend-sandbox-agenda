import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Request, SandboxAllocationUnit, SandboxInstance } from '@muni-kypo-crp/sandbox-model';

export abstract class AbstractSandboxService {
  /**
   * True if server returned error response on the latest request, false otherwise
   * Change internally in extending service. Client should subscribe to the observable
   */
  protected sandboxInstanceHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * True if server returned error response on the latest request, false otherwise
   * @contract must be updated every time new data are received
   */
  sandboxInstanceHasError$: Observable<boolean> = this.sandboxInstanceHasErrorSubject$.asObservable();

  /**
   * True if server returned error response on the latest request, false otherwise
   * Change internally in extending service. Client should subscribe to the observable
   */
  protected allocationUnitHasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * True if server returned error response on the latest request, false otherwise
   * @contract must be updated every time new data are received
   */
  allocationUnitHasError$: Observable<boolean> = this.allocationUnitHasErrorSubject$.asObservable();

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  protected allocationUnitsSubject$: BehaviorSubject<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  allocationUnits$: Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  protected sandboxInstancesSubject$: BehaviorSubject<PaginatedResource<SandboxInstance>>;

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  sandboxInstances$: Observable<PaginatedResource<SandboxInstance>>;

  /**
   * Gets all abstract sandboxes for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for abstract sandbox
   * @param pagination requested pagination
   */
  abstract getAll(
    poolId: number,
    pagination: RequestedPagination
  ): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Starts allocation of a sandbox instance in a provided pool
   * @param poolId id of a pool in which the allocation will take place
   */
  abstract allocate(poolId: number): Observable<any>;

  /**
   * Unlocks a sandbox instance making it available for modification
   * @param sandboxInstance a sandbox instance to be unlocked
   */
  abstract unlock(sandboxInstance: SandboxInstance): Observable<any>;

  /**
   * Lock a sandbox instance making it unavailable for modification and save for usage
   * @param sandboxInstance a sandbox instance to be locked
   */
  abstract lock(sandboxInstance: SandboxInstance): Observable<any>;

  /**
   * Gets zip file that contains configurations, key and script for remote ssh access for user
   * @param sandboxId id of the sandbox for which remote ssh access is demanded
   */
  abstract getUserSshAccess(sandboxId: number): Observable<boolean>;

  abstract showTopology(poolId: number, sandboxInstance: SandboxInstance): Observable<any>;

  abstract cleanupMultiple(poolId: number, unitIds: number[], force?: boolean): Observable<any>;
}
