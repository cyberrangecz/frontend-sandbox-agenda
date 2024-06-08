import { Component, Input, OnInit } from '@angular/core';
import { PoolCommentFormGroup } from './pool-comment-form-group';
import { PoolOverviewService } from '../../services/state/pool-overview/pool-overview.service';

@Component({
  selector: 'kypo-pool-comment',
  templateUrl: './pool-comment.component.html',
  styleUrls: ['./pool-comment.component.css'],
})
export class PoolCommentComponent implements OnInit {
  @Input() commentElement: any;
  commentFormGroup: PoolCommentFormGroup;
  editOpacity = 0;
  editionEnabled = false;

  constructor(private poolOverviewService: PoolOverviewService) {}

  ngOnInit() {
    this.commentFormGroup = new PoolCommentFormGroup(this.commentElement.comment);
  }

  toggleEditButton(show: boolean) {
    this.editOpacity = show ? 100 : 0;
  }

  toggleEdition() {
    this.editionEnabled = !this.editionEnabled;
  }

  onChanged() {
    this.commentFormGroup.setValuesToPool(this.commentElement);
    this.poolOverviewService.updateComment(this.commentElement).subscribe();
  }
}
