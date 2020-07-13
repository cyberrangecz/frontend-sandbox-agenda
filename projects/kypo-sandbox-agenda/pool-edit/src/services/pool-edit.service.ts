import { Pool } from 'kypo-sandbox-model';
import { SandboxDefinition } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';

export abstract class PoolEditService {
  abstract create(pool: Pool): Observable<any>;

  abstract selectDefinition(currSelected: SandboxDefinition): Observable<SandboxDefinition>;
}
