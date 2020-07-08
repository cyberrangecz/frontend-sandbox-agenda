import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { BehaviorSubject, merge, Observable, Subject, timer } from 'rxjs';
import { retryWhen, switchMap, takeWhile, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get stages and other operations to modify data.
 */
export abstract class RequestStagesService {
  protected lastRequest: Request;

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
   * True if response to the latest request was not yet received
   * Change internally in extending service. Client should subscribe to the observable
   */
  protected isLoadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * True if response to the latest request was not yet received
   * @contract must be updated every time new data are received
   */
  isLoading$: Observable<boolean> = this.isLoadingSubject$.asObservable();

  /**
   * Observable triggering retry of polling after it was interrupted (e.g. by error)
   */
  protected retryPolling$: Subject<boolean> = new Subject<boolean>();

  protected stagesSubject$: BehaviorSubject<RequestStage[]> = new BehaviorSubject([]);

  stages$: Observable<RequestStage[]>;

  private pollPeriod: number;

  protected constructor(pollPeriod: number) {
    this.pollPeriod = pollPeriod;
    this.stages$ = merge(this.createPoll(), this.stagesSubject$.asObservable());
  }

  /**
   * Gets all stages and updates related observables or handles an error
   * @param request request associated with stages
   */
  getAll(request: Request): Observable<RequestStage[]> {
    this.onManualResourceRefresh(request);
    return this.callApiToGetStages(request).pipe(
      tap(
        (stages) => {
          this.isLoadingSubject$.next(false);
          this.stagesSubject$.next(stages);
        },
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected refreshResource(): Observable<RequestStage[]> {
    this.hasErrorSubject$.next(false);
    return this.callApiToGetStages(this.lastRequest).pipe(tap({ error: (err) => this.onGetAllError(err) }));
  }

  /**
   * Performs necessary operations and updates state of the service.
   */
  protected onManualResourceRefresh(request: Request) {
    this.isLoadingSubject$.next(true);
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
    this.lastRequest = request;
  }

  protected createPoll(): Observable<RequestStage[]> {
    return timer(0, this.pollPeriod).pipe(
      switchMap((_) => this.refreshResource()),
      retryWhen((_) => this.retryPolling$),
      takeWhile((stages) => !this.stagesFinished(stages) && !this.stageFailed(stages), true)
    );
  }

  protected abstract callApiToGetStages(request: Request): Observable<RequestStage[]>;

  protected abstract onGetAllError(err: HttpErrorResponse): void;

  private stagesFinished(data: RequestStage[]): boolean {
    return data.every((stage) => stage.hasFinished());
  }

  private stageFailed(data: RequestStage[]): boolean {
    return data.some((stage) => stage.hasFailed());
  }
}
