import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { PoolCommentFormGroup } from './pool-comment-form-group';
import {ActivatedRoute} from "@angular/router";
import {PoolEditService} from "@muni-kypo-crp/sandbox-agenda/pool-edit";
import {PoolOverviewService} from "../../services/state/pool-overview/pool-overview.service";
import {PoolChangedEvent} from "../../../../pool-edit/src/model/pool-changed-event";
import {takeWhile} from "rxjs/operators";
import {SentinelBaseDirective} from "@sentinel/common";
import {switchMap, tap} from "rxjs";
import {Pool} from "@muni-kypo-crp/sandbox-model";
import {PoolFormGroup} from "../../../../pool-edit/src/components/pool-form-group";

@Component({
  selector: 'kypo-pool-comment',
  templateUrl: './pool-comment.component.html',
  styleUrls: ['./pool-comment.component.css'],
})
export class PoolCommentComponent extends SentinelBaseDirective implements OnInit {
  @Input() commentElement: any;
  commentFormGroup: PoolCommentFormGroup;
  editOpacity = 0;
  editionEnabled = false;

  constructor(private poolOverviewService: PoolOverviewService) {
    super();
  }

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
