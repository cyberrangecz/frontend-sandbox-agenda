import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Request, SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';

export abstract class SandboxAllocationUnitsService {
  protected constructor() {}

  /**
   * @contract Needs to be updated in onManualResourceRefresh method
   * Last pagination used when requesting new data
   */
  protected lastPagination: RequestedPagination;

  /**
   * Observable triggering retry of polling after it was interrupted (e.g. by error)
   */
  protected retryPolling$: Subject<boolean> = new Subject<boolean>();

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
    pagination: RequestedPagination
  ): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Cancels a sandbox allocation units for pool, informs about the result and updates list of sandbox allocation units
   * or handles an error
   * @param request a request to be cancelled
   */
  abstract cleanup(request: Request): Observable<any>;

  /**
   * Performs necessary operations and updates state of the service.
   * @contract Needs to update lastPagination attribute, hasError subject and retry polling
   * if it was previously interrupted
   * @param pagination new requested pagination
   * @param params any other parameters required to update data in your concrete service
   */
  protected abstract onManualResourceRefresh(pagination: RequestedPagination, ...params);

  /**
   * @contract must update resource and hasErrorSubject
   * Repeats last get all request for polling purposes
   */
  protected abstract refreshResources(): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Creates poll observable using a timer. You can extend the behaviour by piping the observable and applying
   * RxJs operators on it (e.g. takeWhile to stop polling on specific conditions)
   */
  protected abstract createPoll(): Observable<PaginatedResource<SandboxAllocationUnit>>;

  /**
   * Initializes default resources with given pageSize
   * @param pageSize size of a page for pagination
   */
  protected abstract initSubject(pageSize: number): PaginatedResource<SandboxAllocationUnit>;
}
