import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { defer, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SandboxDefinitionEditService } from '../services/sandbox-definition-edit.service';
import { SandboxDefinitionFormGroup } from './sandbox-definition-edit-form-group';
import { AbstractControl } from '@angular/forms';

/**
 * Component with form for creating new sandbox definition
 */
@Component({
  selector: 'kypo-create-sandbox-definition',
  templateUrl: './sandbox-definition-edit.component.html',
  styleUrls: ['./sandbox-definition-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxDefinitionEditComponent extends SentinelBaseDirective implements OnInit {
  sandboxDefinitionFormGroup: SandboxDefinitionFormGroup;
  controls: SentinelControlItem[];

  constructor(private sandboxDefinitionService: SandboxDefinitionEditService) {
    super();
  }

  ngOnInit(): void {
    this.sandboxDefinitionFormGroup = new SandboxDefinitionFormGroup();
    this.initControls();
    this.sandboxDefinitionFormGroup.formGroup.valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.initControls());
  }

  get gitlabUrl(): AbstractControl {
    return this.sandboxDefinitionFormGroup.formGroup.get('gitlabUrl');
  }

  get revision(): AbstractControl {
    return this.sandboxDefinitionFormGroup.formGroup.get('revision');
  }

  onControlsAction(control: SentinelControlItem): void {
    control.result$.pipe(takeWhile(() => this.isAlive)).subscribe();
  }

  keyDownAction(event: KeyboardEvent): void {
    if (this.sandboxDefinitionFormGroup.formGroup.valid && event.key === 'Enter') {
      this.controls[0].result$.pipe(takeWhile(() => this.isAlive)).subscribe();
    }
  }

  private initControls() {
    this.controls = [
      new SentinelControlItem(
        'create',
        'Create',
        'primary',
        of(!this.sandboxDefinitionFormGroup.formGroup.valid),
        defer(() => this.sandboxDefinitionService.create(this.sandboxDefinitionFormGroup.createFromValues()))
      ),
    ];
  }
}
