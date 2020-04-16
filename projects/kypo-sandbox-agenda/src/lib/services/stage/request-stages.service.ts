import { KypoPaginatedResourceService } from 'kypo-common';
import { KypoPaginatedResource } from 'kypo-common';
import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get stages and other operations to modify data.
 */
export abstract class RequestStagesService extends KypoPaginatedResourceService<RequestStage> {
  /**
   * @param request request associated with stages
   */
  abstract getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>>;
}
