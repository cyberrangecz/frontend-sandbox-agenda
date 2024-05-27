import { Component, Input, OnInit } from '@angular/core';
import { CommentFormGroup } from './comment-form-group';
import { SentinelBaseDirective } from '@sentinel/common';
import { SandboxAllocationUnitsService } from '@muni-kypo-crp/sandbox-agenda/pool-detail';
import { SandboxAllocationUnit } from '@muni-kypo-crp/sandbox-model';

@Component({
  selector: 'kypo-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent extends SentinelBaseDirective implements OnInit {
  @Input() commentElement: SandboxAllocationUnit;
  commentFormGroup: CommentFormGroup;
  editOpacity = 0;
  editionEnabled = false;

  constructor(private sandboxAuService: SandboxAllocationUnitsService) {
    super();
  }

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
