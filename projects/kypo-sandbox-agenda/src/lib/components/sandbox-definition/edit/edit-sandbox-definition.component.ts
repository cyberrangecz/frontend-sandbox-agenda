import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KypoBaseComponent } from 'kypo-common';
import { KypoControlItem } from 'kypo-controls';
import { defer, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SandboxDefinitionDetailService } from '../../../services/sandbox-definition/detail/sandbox-definition-detail.service';
import { SandboxDefinitionFormGroup } from './edit-sandbox-definition-form-group';

/**
 * Component with form for creating new sandbox definition
 */
@Component({
  selector: 'kypo-create-sandbox-definition',
  templateUrl: './edit-sandbox-definition.component.html',
  styleUrls: ['./edit-sandbox-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSandboxDefinitionComponent extends KypoBaseComponent implements OnInit {
  sandboxDefinitionFormGroup: SandboxDefinitionFormGroup;
  controls: KypoControlItem[];

  constructor(private sandboxDefinitionService: SandboxDefinitionDetailService) {
    super();
  }

  ngOnInit() {
    this.sandboxDefinitionFormGroup = new SandboxDefinitionFormGroup();
    this.initControls();
    this.sandboxDefinitionFormGroup.formGroup.valueChanges
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe((_) => this.initControls());
  }

  get gitlabUrl() {
    return this.sandboxDefinitionFormGroup.formGroup.get('gitlabUrl');
  }

  get revision() {
    return this.sandboxDefinitionFormGroup.formGroup.get('revision');
  }

  onControlsAction(control: KypoControlItem) {
    control.result$.pipe(takeWhile((_) => this.isAlive)).subscribe();
  }

  private initControls() {
    this.controls = [
      new KypoControlItem(
        'create',
        'Create',
        'primary',
        of(!this.sandboxDefinitionFormGroup.formGroup.valid),
        defer(() => this.sandboxDefinitionService.create(this.sandboxDefinitionFormGroup.createFromValues()))
      ),
    ];
  }
}
