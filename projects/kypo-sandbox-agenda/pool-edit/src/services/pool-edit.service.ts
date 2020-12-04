import { Pool } from '@muni-kypo-crp/sandbox-model';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Observable } from 'rxjs';

export abstract class PoolEditService {
  abstract create(pool: Pool): Observable<any>;

  abstract selectDefinition(currSelected: SandboxDefinition): Observable<SandboxDefinition>;
}
