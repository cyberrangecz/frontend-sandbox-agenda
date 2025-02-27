import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PoolCommentFormGroup } from './pool-comment-form-group';
import { PoolOverviewService } from '../../services/state/pool-overview/pool-overview.service';
import { Pool } from '@crczp/sandbox-model';

@Component({
    selector: 'crczp-pool-comment',
    templateUrl: './pool-comment.component.html',
    styleUrls: ['./pool-comment.component.css'],
})
export class PoolCommentComponent implements OnInit, OnChanges {
    @Input() element: Pool;
    commentFormGroup: PoolCommentFormGroup;
    editOpacity = 0;
    editionEnabled = false;

    constructor(private poolOverviewService: PoolOverviewService) {}

    ngOnInit() {
        if (!this.commentFormGroup) {
            this.initFormGroup();
        }
    }

    private initFormGroup() {
        this.commentFormGroup = new PoolCommentFormGroup(this.element.comment);
    }

    toggleEditButton(show: boolean) {
        this.editOpacity = show ? 100 : 0;
    }

    toggleEdition() {
        this.editionEnabled = !this.editionEnabled;
    }

    onInput() {
        this.commentFormGroup.setValuesToPool(this.element);
        this.poolOverviewService.updateComment(this.element).subscribe();
    }

    ngOnChanges() {
        if (!this.commentFormGroup) {
            this.initFormGroup();
        } else {
            this.commentFormGroup.formGroup.get('comment').setValue(this.element.comment);
        }
    }
}
