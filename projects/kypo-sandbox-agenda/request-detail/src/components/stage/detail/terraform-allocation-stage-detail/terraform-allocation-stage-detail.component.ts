import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SentinelBaseDirective, OffsetPaginationEvent, PaginatedResource } from '@sentinel/common';
import { TerraformStageAdapter } from '../../../../model/adapters/terraform-stage-adapter';
import { Observable } from 'rxjs';
import { TerraformOutputsService } from '../../../../services/state/detail/terraform-outputs.service';
import { CloudResourcesService } from '../../../../services/state/detail/cloud-resources.service';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'kypo-terraform-allocation-stage-detail',
  templateUrl: './terraform-allocation-stage-detail.component.html',
  styleUrls: ['./terraform-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TerraformOutputsService, CloudResourcesService],
})
export class TerraformAllocationStageDetailComponent extends SentinelBaseDirective implements OnChanges {
  readonly PAGE_SIZE = Number.MAX_SAFE_INTEGER;

  @Input() stage: TerraformStageAdapter;
  outputs$: Observable<PaginatedResource<string>>;
  hasOutputs$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  constructor(private outputsService: TerraformOutputsService, private resourcesService: CloudResourcesService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stage && 'stage' in changes && changes['stage'].isFirstChange()) {
      this.init();
    }
  }

  init(): void {
    const initialPagination = new OffsetPaginationEvent(0, this.PAGE_SIZE, '', '');
    this.onFetchEvents(initialPagination);

    this.outputs$ = this.outputsService.resource$.pipe(takeWhile(() => this.isAlive));
    this.hasOutputs$ = this.outputs$.pipe(map((events) => events.elements.length > 0));
    this.isLoading$ = this.outputsService.isLoading$.pipe(takeWhile(() => this.isAlive));
    this.hasError$ = this.outputsService.hasError$.pipe(takeWhile(() => this.isAlive));
  }

  onFetchEvents(requestedPagination: OffsetPaginationEvent): void {
    this.outputsService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }
}
