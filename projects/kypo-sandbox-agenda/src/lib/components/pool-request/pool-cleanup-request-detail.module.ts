import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolRequestDetailModule} from './pool-request-detail.module';
import {RequestStagesPollingService} from '../../services/stage/request-stages-polling.service';
import {StageDetailService} from '../../services/stage/detail/stage-detail.service';
import {CleanupStageDetailPollingService} from '../../services/stage/detail/cleanup-stage-detail-polling.service';
import {RequestCleanupStagesPollingService} from '../../services/stage/request-cleanup-stages-polling.service';

@NgModule({
  imports: [
    CommonModule,
    PoolRequestDetailModule
  ],
  providers: [
    { provide: RequestStagesPollingService, useClass: RequestCleanupStagesPollingService},
    { provide: StageDetailService, useClass: CleanupStageDetailPollingService }
  ]
  })
export class PoolCleanupRequestDetailModule {

}
