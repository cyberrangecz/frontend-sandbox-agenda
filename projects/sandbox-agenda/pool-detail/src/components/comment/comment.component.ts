import { Component, Input, OnInit } from '@angular/core';
import { CommentFormGroup } from './comment-form-group';
import { SandboxAllocationUnitsService } from '../../services/state/sandbox-allocation-unit/sandbox-allocation-units.service';
import { SandboxAllocationUnitsConcreteService } from '../../services/state/sandbox-allocation-unit/sandbox-allocation-units-concrete.service';
import { SandboxAllocationUnit } from '@cyberrangecz-platform/sandbox-model';

@Component({
  selector: 'crczp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  providers: [{ provide: SandboxAllocationUnitsService, useClass: SandboxAllocationUnitsConcreteService }],
})
export class CommentComponent implements OnInit {
  @Input() commentElement: SandboxAllocationUnit;
  commentFormGroup: CommentFormGroup;
  editOpacity = 0;
  editionEnabled = false;

  constructor(private sandboxAuService: SandboxAllocationUnitsService) {}

  ngOnInit() {
    this.commentFormGroup = new CommentFormGroup(this.commentElement.comment);
  }

  toggleEditButton(show: boolean) {
    this.editOpacity = show ? 100 : 0;
  }

  toggleEdition() {
    this.editionEnabled = !this.editionEnabled;
  }

  onChanged() {
    this.commentFormGroup.setValuesToUnit(this.commentElement);
    this.sandboxAuService.update(this.commentElement).subscribe();
  }
}
