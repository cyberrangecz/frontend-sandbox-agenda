import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SandboxAllocationUnit } from '@crczp/sandbox-model';

export class CommentFormGroup {
    formGroup: UntypedFormGroup;

    constructor(comment: string) {
        this.formGroup = new UntypedFormGroup({
            comment: new UntypedFormControl(comment, [Validators.maxLength(256)]),
        });
    }

    setValuesToUnit(sandboxUnit: SandboxAllocationUnit): void {
        sandboxUnit.id = sandboxUnit['unitId'];
        sandboxUnit.comment = this.formGroup.get('comment').value;
    }
}
