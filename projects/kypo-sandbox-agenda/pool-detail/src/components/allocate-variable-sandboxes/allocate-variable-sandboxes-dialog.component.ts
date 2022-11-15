import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SentinelBaseDirective } from '@sentinel/common';
import { SandboxAllocationFormGroup } from './sandbox-allocation-form-group';
import { AbstractControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
/**
 * Popup dialog to choose number of sandboxes to allocate
 */
@Component({
  selector: 'kypo-allocate-variable-sandboxes-selector',
  templateUrl: './allocate-variable-sandboxes-dialog.component.html',
  styleUrls: ['./allocate-variable-sandboxes-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocateVariableSandboxesDialogComponent extends SentinelBaseDirective implements OnInit {
  sandboxAllocationFormGroup: SandboxAllocationFormGroup;
  count: number;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<AllocateVariableSandboxesDialogComponent>
  ) {
    super();
    this.sandboxAllocationFormGroup = new SandboxAllocationFormGroup(this.data);
    this.allocationSize.setValue(data);
  }

  get allocationSize(): AbstractControl {
    return this.sandboxAllocationFormGroup.formGroup.get('allocationSize');
  }

  ngOnInit() {
    this.sandboxAllocationFormGroup.formGroup.valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((_) => console.log(_));
  }

  getSliderValue(event) {
    this.allocationSize.setValue(event.value);
  }

  changeAllocationValue(value: number) {
    this.allocationSize.setValue(this.allocationSize.value + value);
  }

  /**
   * Closes the dialog window and passes the selected option to its parent component
   */
  confirm(): void {
    const result = {
      type: 'confirm',
      result: this.allocationSize.value,
    };
    this.dialogRef.close(result);
  }

  /**
   * Closes the dialog window without passing the selected option
   */
  cancel(): void {
    const result = {
      type: 'cancel',
      result: null,
    };
    this.dialogRef.close(result);
  }
}
