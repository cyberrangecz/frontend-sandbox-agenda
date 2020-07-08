import { Component, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { defer, of } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { PoolEditService } from '../../../services/pool/pool-edit.service';
import { SandboxPoolFormGroup } from './sandbox-pool-form-group';

/**
 * Component with form for creating pool
 */
@Component({
  selector: 'kypo-sandbox-pool-create',
  templateUrl: './sandbox-pool-edit.component.html',
  styleUrls: ['./sandbox-pool-edit.component.css'],
})
export class SandboxPoolEditComponent extends SentinelBaseDirective implements OnInit {
  poolFormGroup: SandboxPoolFormGroup;
  controls: SentinelControlItem[];

  constructor(private poolEditService: PoolEditService) {
    super();
  }

  ngOnInit(): void {
    this.poolFormGroup = new SandboxPoolFormGroup();
    this.initControls();
    this.poolFormGroup.formGroup.valueChanges
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe((_) => this.initControls());
  }

  get sandboxDefinition() {
    return this.poolFormGroup.formGroup.get('sandboxDefinition');
  }

  get poolSize() {
    return this.poolFormGroup.formGroup.get('poolSize');
  }

  onControlsAction(control: SentinelControlItem) {
    control.result$.pipe(take(1)).subscribe();
  }

  selectSandboxDefinition() {
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

  initControls() {
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
