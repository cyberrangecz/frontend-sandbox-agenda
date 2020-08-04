import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RequestStagesService } from '../../services/state/request-stages.service';
import { RequestDetailComponent } from '../shared/request-detail.component';
import { AllocationStagesConcreteService } from '../../services/state/allocation-stages-concrete.service';
import { ActivatedRoute } from '@angular/router';
import { StagesDetailPollRegistry } from '../../services/state/detail/stages-detail-poll-registry.service';

@Component({
  selector: 'kypo-allocation-request-detail',
  templateUrl: '../shared/request-detail.component.html',
  styleUrls: ['../shared/request-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: RequestStagesService, useClass: AllocationStagesConcreteService }, StagesDetailPollRegistry],
})
export class AllocationRequestDetailComponent extends RequestDetailComponent {
  constructor(
    protected activeRoute: ActivatedRoute,
    protected requestStagesService: RequestStagesService,
    protected stageDetailRegistry: StagesDetailPollRegistry
  ) {
    super(activeRoute, requestStagesService, stageDetailRegistry);
  }
}
