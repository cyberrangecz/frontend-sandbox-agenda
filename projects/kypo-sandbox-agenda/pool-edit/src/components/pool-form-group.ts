import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Pool, SandboxDefinition } from '@muni-kypo-crp/sandbox-model';

export class PoolFormGroup {
  formGroup: UntypedFormGroup;

  constructor() {
    this.formGroup = new UntypedFormGroup({
      poolSize: new UntypedFormControl(1, [Validators.required, Validators.min(1)]),
      sandboxDefinition: new UntypedFormControl(undefined, [Validators.required]),
    });
  }

  createPoolFromValues(): Pool {
    const pool = new Pool();
    pool.definition = new SandboxDefinition();
    pool.definition.id = this.formGroup.get('sandboxDefinition').value?.id;
    pool.maxSize = this.formGroup.get('poolSize').value;
    return pool;
  }
}
