import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Pool } from '@cyberrangecz-platform/sandbox-model';

export class PoolCommentFormGroup {
  formGroup: UntypedFormGroup;

  constructor(comment = '') {
    this.formGroup = new UntypedFormGroup({
      comment: new UntypedFormControl(comment, [Validators.maxLength(256)]),
    });
  }

  setValuesToPool(pool: Pool): void {
    pool.comment = this.formGroup.get('comment').value;
  }
}
