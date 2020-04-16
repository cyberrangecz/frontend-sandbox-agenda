import { SandboxDefinition } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';

export abstract class SandboxDefinitionDetailService {
  /**
   * Creates a sandbox definition, informs about the result and updates list of sandbox definitions or handles an error
   * @param sandboxDefinition Sandbox definition to create
   */
  abstract create(sandboxDefinition: SandboxDefinition): Observable<any>;
}
