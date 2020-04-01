import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolRequestDetailModule} from './pool-request-detail.module';
import {RequestStagesPollingService} from '../../services/stage/request-stages-polling.service';
import {AllocationStageDetailPollingService} from '../../services/stage/detail/allocation-stage-detail-polling.service';
import {StageDetailService} from '../../services/stage/detail/stage-detail.service';
import {RequestAllocationStagesPollingService} from '../../services/stage/request-allocation-stages-polling.service';

@NgModule({
  imports: [
    CommonModule,
    PoolRequestDetailModule
  ],
  providers: [
    { provide: RequestStagesPollingService, useClass: RequestAllocationStagesPollingService},
    { provide: StageDetailService, useClass: AllocationStageDetailPollingService }
  ]
})
export class PoolAllocationRequestDetailModule {
}
