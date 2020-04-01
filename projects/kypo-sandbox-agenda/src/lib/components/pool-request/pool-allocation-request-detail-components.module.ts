import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolRequestDetailComponentsModule} from './pool-request-detail-components.module';
import {RequestStagesPollingService} from '../../services/stage/request-stages-polling.service';
import {AllocationStageDetailPollingService} from '../../services/stage/detail/allocation-stage-detail-polling.service';
import {StageDetailService} from '../../services/stage/detail/stage-detail.service';
import {RequestAllocationStagesPollingService} from '../../services/stage/request-allocation-stages-polling.service';
import {SandboxAgendaConfig} from '../../model/client/sandbox-agenda-config';

@NgModule({
  imports: [
    CommonModule,
    PoolRequestDetailComponentsModule
  ],
  providers: [
    { provide: RequestStagesPollingService, useClass: RequestAllocationStagesPollingService},
    { provide: StageDetailService, useClass: AllocationStageDetailPollingService }
  ]
})
export class PoolAllocationRequestDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolAllocationRequestDetailComponentsModule> {
    return {
      ngModule: PoolAllocationRequestDetailComponentsModule,
      providers: [
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
