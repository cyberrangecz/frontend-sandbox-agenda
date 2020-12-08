import { Component, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { defer, of } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { PoolEditService } from '../services/pool-edit.service';
import { PoolFormGroup } from './pool-form-group';
import { AbstractControl } from '@angular/forms';

/**
 * Component with form for creating pool
 */
@Component({
  selector: 'kypo-sandbox-pool-create',
  templateUrl: './pool-edit.component.html',
  styleUrls: ['./pool-edit.component.css'],
})
export class PoolEditComponent extends SentinelBaseDirective implements OnInit {
  poolFormGroup: PoolFormGroup;
  controls: SentinelControlItem[];

  constructor(private poolEditService: PoolEditService) {
    super();
  }

  ngOnInit(): void {
    this.poolFormGroup = new PoolFormGroup();
    this.initControls();
    this.poolFormGroup.formGroup.valueChanges.pipe(takeWhile(() => this.isAlive)).subscribe(() => this.initControls());
  }

  get sandboxDefinition(): AbstractControl {
    return this.poolFormGroup.formGroup.get('sandboxDefinition');
  }

  get poolSize(): AbstractControl {
    return this.poolFormGroup.formGroup.get('poolSize');
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

  initControls(): void {
    this.controls = [
      new SentinelControlItem(
        'create',
        'Create',
        'primary',
        of(!this.poolFormGroup.formGroup.valid),
        defer(() => this.poolEditService.create(this.poolFormGroup.createPoolFromValues()))
      ),
    ];
  }
}
