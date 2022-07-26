import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';

export abstract class SandboxAllocationUnitsService {
  /**
   * @contract Needs to be updated in onManualResourceRefresh method
   * Last pagination used when requesting new data
   */
  protected lastPagination: OffsetPaginationEvent;

  /**
   * True if server returned error response on the latest request, false otherwise
   * Change internally in extending service. Client should subscribe to the observable
   */
  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * True if server returned error response on the latest request, false otherwise
   * @contract must be updated every time new data are received
   */
  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  protected unitsSubject$: BehaviorSubject<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Paginated resource containing pagination info and retrieved elements of SandboxAllocationUnit type.
   * Client should subscribe to the observable
   * @contract must be updated every time new data are received
   */
  units$: Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  abstract getAll(
    poolId: number,
    pagination: OffsetPaginationEvent
  ): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Initializes default resources with given pageSize
   * @param pageSize size of a page for pagination
   */
  protected abstract initSubject(pageSize: number): PaginatedResource<SandboxAllocationUnit>;

  abstract cleanupMultiple(poolId: number, unitIds: number[], force?: boolean): Observable<any>;
}
