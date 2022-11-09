import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SentinelBaseDirective } from '@sentinel/common';
/**
 * Popup dialog to choose number of sandboxes to allocate
 */
@Component({
  selector: 'kypo-allocate-variable-sandboxes-selector',
  templateUrl: './allocate-variable-sandboxes-dialog.component.html',
  styleUrls: ['./allocate-variable-sandboxes-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocateVariableSandboxesDialogComponent extends SentinelBaseDirective {
  count: number;
  selected: number;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<AllocateVariableSandboxesDialogComponent>
  ) {
    super();
    this.selected = data;
  }

  getSliderValue(event) {
    this.selected = event.value;
  }

  changeAllocationValue(value: number) {
    if (this.selected + value >= 0 && this.selected + value <= this.data) {
      this.selected += value;
    }
  }

  /**
   * Closes the dialog window and passes the selected option to its parent component
   */
  confirm(): void {
    const result = {
      type: 'confirm',
      result: this.selected,
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
