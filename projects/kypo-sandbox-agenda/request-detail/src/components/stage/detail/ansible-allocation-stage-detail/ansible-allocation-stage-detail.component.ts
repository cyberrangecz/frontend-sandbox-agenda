import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SentinelBaseDirective, RequestedPagination, PaginatedResource } from '@sentinel/common';
import { AnsibleStageAdapter } from '../../../../model/adapters/ansible-stage-adapter';
import { Observable } from 'rxjs';
import { AnsibleOutputsService } from '../../../../services/state/detail/ansible-outputs.service';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'kypo-ansible-allocation-stage-detail',
  templateUrl: './ansible-allocation-stage-detail.component.html',
  styleUrls: ['./ansible-allocation-stage-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnsibleOutputsService],
})
export class AnsibleAllocationStageDetailComponent extends SentinelBaseDirective implements OnInit, OnChanges {
  readonly PAGE_SIZE = 500;

  @Input() stage: AnsibleStageAdapter;

  outputs$: Observable<PaginatedResource<string>>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  hasOutputs$: Observable<boolean>;

  constructor(private outputsService: AnsibleOutputsService) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.stage && 'stage' in changes && changes['stage'].isFirstChange()) {
      this.init();
    }
  }

  init() {
    const initialPagination = new RequestedPagination(0, 500, '', '');
    this.onFetch(initialPagination);
    this.outputs$ = this.outputsService.resource$.pipe(takeWhile((_) => this.isAlive));
    this.hasOutputs$ = this.outputs$.pipe(map((outputs) => outputs.elements.length > 0));
    this.isLoading$ = this.outputsService.isLoading$.pipe(takeWhile((_) => this.isAlive));
    this.hasError$ = this.outputsService.hasError$.pipe(takeWhile((_) => this.isAlive));
  }

  onFetch(requestedPagination: RequestedPagination) {
    this.outputsService
      .getAll(this.stage, requestedPagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }
}
