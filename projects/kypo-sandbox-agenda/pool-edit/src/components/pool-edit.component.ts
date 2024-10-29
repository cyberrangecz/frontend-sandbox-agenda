import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class PoolEditComponent {
  pool: Pool;
  poolFormGroup: PoolFormGroup;
  editMode = false;
  canDeactivatePoolEdit = true;
  controls: SentinelControlItem[];

  constructor(
    private activeRoute: ActivatedRoute,
    private poolEditService: PoolEditService,
  ) {
    this.activeRoute.data
      .pipe(
        tap((data) => {
          this.pool = data.pool === undefined ? new Pool() : data.pool;
          this.poolEditService.set(data.pool);
        }),
        switchMap(() => this.poolEditService.editMode$),
        tap((editMode) => {
          this.editMode = editMode;
          this.initControls(editMode);
          this.poolFormGroup = new PoolFormGroup(this.pool, editMode);
        }),
        switchMap(() => this.poolFormGroup.formGroup.valueChanges),
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
    this.controls = [
      new SentinelControlItem(
        isEditMode ? 'save' : 'create',
        isEditMode ? 'Save' : 'Create',
        'primary',
        this.poolEditService.saveDisabled$,
        defer(() => this.poolEditService.save()),
      ),
    ];
  }

  /**
   * Check the amount of allocated sandboxes and make sure the user doesn't set the number below.
   */
  getMinimumPoolSize(): number {
    const amount = this.pool ? this.pool.usedSize : 0;
    return amount;
  }

  private onChanged() {
    this.poolFormGroup.setValuesToPool(this.pool);
    this.canDeactivatePoolEdit = false;
    const change: PoolChangedEvent = new PoolChangedEvent(this.pool, this.poolFormGroup.formGroup.valid);
    this.poolEditService.change(change);
  }
}
