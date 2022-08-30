import {
  PaginatedResource,
  OffsetPaginationEvent,
  OffsetPaginatedElementsPollingService,
  PaginationBaseEvent,
} from '@sentinel/common';
import { SandboxAllocationUnit, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated sandbox instances and other operations to modify data.
 */
export abstract class SandboxInstanceService extends OffsetPaginatedElementsPollingService<SandboxInstance> {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }

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
   * @param poolId id of a pool associated with sandbox instances
   * @param pagination requested pagination
   */
  abstract getAllSandboxes(
    poolId: number,
    pagination: OffsetPaginationEvent
  ): Observable<PaginatedResource<SandboxInstance>>;

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  abstract getAllUnits(
    poolId: number,
    pagination: PaginationBaseEvent
  ): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Deletes a sandbox instance
   * @param sandboxInstance a sandbox instance to be deleted
   */
  abstract delete(sandboxInstance: SandboxInstance): Observable<any>;

  /**
   * Starts allocation of a sandbox instance in a provided pool
   * @param poolId id of a pool in which the allocation will take place
   */
  abstract allocate(poolId: number): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Retries an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param unitId id of a unit for which retry will be performed
   */
  abstract retryAllocate(unitId: number): Observable<PaginatedResource<SandboxInstance>>;

  /**
   * Unlocks a sandbox instance making it available for modification
   * @param allocationUnitId a sandbox instance to be unlocked represented by its id
   */
  abstract unlock(allocationUnitId: number): Observable<any>;

  /**
   * Lock a sandbox instance making it unavailable for modification and save for usage
   * @param allocationUnitId a sandbox instance to be unlocked represented by its id
   */
  abstract lock(allocationUnitId: number): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Gets zip file that contains configurations, key and script for remote ssh access for user
   * @param sandboxId id of the sandbox for which remote ssh access is demanded
   */
  abstract getUserSshAccess(sandboxId: number): Observable<boolean>;

  /**
   * Redirects to topology associated with given allocation unit of the given pool
   * @param poolId id of the pool
   * @param allocationUnitId id of the allocation unit
   */
  abstract showTopology(poolId: number, allocationUnitId: number): Observable<boolean>;

  /**
   * Starts cleanup for multiple sandboxes specified in @unitIds. If left as empty array deletes
   * all allocation units in pool identified by @poolId
   * @param poolId id of pool for which the cleanup request of units is created
   * @param unitIds array of allocation unit ids which should be deleted
   * @param force when set to true force delete is used
   */
  abstract cleanupMultiple(poolId: number, unitIds: number[], force: boolean): Observable<any>;

  /**
   * Starts cleanup for sandbox specified in @unitIds.
   * @param unitId allocation unit id which should be deleted
   */
  abstract createCleanup(unitId: number): Observable<any>;

  /**
   * Redirects to desired detail of stage of the allocation unit.
   * @param poolId id of the pool
   * @param sandboxId id of allocation unit
   * @param stageOrder order of desired stage
   */
  abstract navigateToStage(poolId: number, sandboxId: number, stageOrder: number): Observable<boolean>;
}
