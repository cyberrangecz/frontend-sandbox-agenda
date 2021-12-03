import { Observable } from 'rxjs';
import { HardwareUsage } from '@muni-kypo-crp/sandbox-model';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 */
export abstract class SandboxLimitsService {
  limits$: Observable<HardwareUsage>;

  abstract getLimits(): Observable<HardwareUsage>;
}
