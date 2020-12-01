import { Observable } from 'rxjs';
import { Resources } from '@kypo/sandbox-model';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 */
export abstract class SandboxResourcesService {
  resources$: Observable<Resources>;
  constructor() {}

  abstract getResources(): Observable<Resources>;
}
