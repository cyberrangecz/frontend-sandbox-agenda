import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { defer, switchMap, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { PoolEditService } from '../services/pool-edit.service';
import { PoolFormGroup } from './pool-form-group';
import { AbstractControl } from '@angular/forms';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { ActivatedRoute } from '@angular/router';
import { PoolChangedEvent } from '../model/pool-changed-event';

/**
 * Component with form for creating pool
 */
@Component({
  selector: 'kypo-sandbox-pool-create',
  templateUrl: './pool-edit.component.html',
  styleUrls: ['./pool-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoolEditComponent extends SentinelBaseDirective {
  pool: Pool;
  poolFormGroup: PoolFormGroup;
  editMode = false;
  canDeactivatePoolEdit = true;
  controls: SentinelControlItem[];

  constructor(private activeRoute: ActivatedRoute, private poolEditService: PoolEditService) {
    super();
    this.activeRoute.data
      .pipe(
        tap((data) => {
          this.pool = data.pool === undefined ? new Pool() : data.pool;
          this.poolEditService.set(data.pool);
        }),
        switchMap((data) => this.poolEditService.editMode$),
        tap((editMode) => {
          this.editMode = editMode;
          this.initControls(editMode);
          this.poolFormGroup = new PoolFormGroup(this.pool, editMode);
        }),
        switchMap(() => this.poolFormGroup.formGroup.valueChanges)
      )
      .subscribe(() => this.onChanged());
  }

  get sandboxDefinition(): AbstractControl {
    return this.poolFormGroup.formGroup.get('sandboxDefinition');
  }

  get poolSize(): AbstractControl {
    return this.poolFormGroup.formGroup.get('poolSize');
  }

  get comment(): AbstractControl {
    return this.poolFormGroup.formGroup.get('comment');
  }

  onControlsAction(control: SentinelControlItem): void {
    control.result$.pipe(take(1)).subscribe();
  }

  selectSandboxDefinition(): void {
    this.poolEditService
      .selectDefinition(this.sandboxDefinition.value)
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.poolFormGroup.formGroup.markAsDirty();
          this.sandboxDefinition.setValue(result);
        }
      });
  }

  initControls(isEditMode: boolean): void {
    const saveItem = new SentinelControlItem(
      'save',
      'Save',
      'primary',
      this.poolEditService.saveDisabled$,
      defer(() => this.poolEditService.save())
    );
    if (!isEditMode) {
      saveItem.id = 'create';
      saveItem.label = 'Create';
    }
    this.controls = [saveItem];
  }

  private onChanged() {
    this.poolFormGroup.setValuesToPool(this.pool);
    this.canDeactivatePoolEdit = false;
    const change: PoolChangedEvent = new PoolChangedEvent(this.pool, this.poolFormGroup.formGroup.valid);
    this.poolEditService.change(change);
  }
}
