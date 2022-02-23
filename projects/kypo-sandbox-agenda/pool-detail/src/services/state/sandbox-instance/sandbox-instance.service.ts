import { PaginatedResource, RequestedPagination, PaginatedResourcePollingService } from '@sentinel/common';
import { SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { Observable } from 'rxjs';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated sandbox instances and other operations to modify data.
 */
export abstract class SandboxInstanceService extends PaginatedResourcePollingService<SandboxInstance> {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }

  /**
   * @param poolId id of a pool associated with sandbox instances
   * @param pagination requested pagination
   */
  abstract getAll(poolId: number, pagination: RequestedPagination): Observable<PaginatedResource<SandboxInstance>>;

  /**
   * Deletes a sandbox instance
   * @param sandboxInstance a sandbox instance to be deleted
   */
  abstract delete(sandboxInstance: SandboxInstance): Observable<any>;

  /**
   * Starts allocation of a sandbox instance in a provided pool
   * @param poolId id of a pool in which the allocation will take place
   */
  abstract allocate(poolId: number): Observable<any>;

  /**
   * Retries an allocation of a sandbox instance, informs about the result and updates list of requests or handles an error
   * @param unitId id of a unit for which retry will be performed
   */
  abstract retryAllocate(unitId: number): Observable<PaginatedResource<SandboxInstance>>;

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
}
