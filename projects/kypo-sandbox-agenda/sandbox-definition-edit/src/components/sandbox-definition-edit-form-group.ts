import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';

/**
 * Sandbox Definition create form
 */
export class SandboxDefinitionFormGroup {
  formGroup: UntypedFormGroup;

  constructor() {
    this.formGroup = new UntypedFormGroup({
      gitlabUrl: new UntypedFormControl('', Validators.required),
      revision: new UntypedFormControl('', Validators.required),
    });
  }

  createFromValues(): SandboxDefinition {
    const definition = new SandboxDefinition();
    definition.url = this.formGroup.get('gitlabUrl').value;
    definition.rev = this.formGroup.get('revision').value;
    return definition;
  }
}
