import { KypoPaginatedResource, KypoPaginatedResourcePollingService } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get stages and other operations to modify data.
 */
export abstract class RequestStagesService extends KypoPaginatedResourcePollingService<RequestStage> {
  /**
   * @param request request associated with stages
   */
  abstract getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>>;

  protected createPoll(): Observable<KypoPaginatedResource<RequestStage>> {
    return super
      .createPoll()
      .pipe(takeWhile((data) => !this.stagesFinished(data.elements) && !this.stageFailed(data.elements), true));
  }

  private stagesFinished(data: RequestStage[]): boolean {
    return data.every((stage) => stage.hasFinished());
  }

  private stageFailed(data: RequestStage[]): boolean {
    return data.some((stage) => stage.hasFailed());
  }
}
