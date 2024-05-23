import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import {defer, Observable} from 'rxjs';
import {map, take, takeWhile} from 'rxjs/operators';
import { PoolEditService } from '../services/pool-edit.service';
import { PoolFormGroup } from './pool-form-group';
import { AbstractControl } from '@angular/forms';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { ActivatedRoute } from '@angular/router';
import {PoolChangedEvent} from "../../../pool-overview/src/model/pool-changed-event";

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
    this.activeRoute.data.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
      this.pool = data.pool === undefined ? new Pool() : data.pool;
      this.poolEditService.set(data.pool);
      this.poolEditService.editMode$.subscribe((edit) => {
        this.editMode = edit;
        this.initControls(edit);
        this.poolFormGroup = new PoolFormGroup(data.pool, edit);
        this.poolFormGroup.formGroup.valueChanges.pipe(takeWhile(() => this.isAlive)).subscribe(() => this.onChanged());
      });
    });
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
