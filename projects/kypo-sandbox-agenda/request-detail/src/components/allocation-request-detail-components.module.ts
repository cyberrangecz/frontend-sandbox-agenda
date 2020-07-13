import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SandboxAgendaConfig } from 'kypo-sandbox-agenda';
import { AllocationStageDetailPollingService } from '../services/state/detail/allocation-stage-detail-polling.service';
import { StageDetailService } from '../services/state/detail/stage-detail.service';
import { RequestAllocationStagesConcreteService } from '../services/state/request-allocation-stages-concrete.service';
import { RequestStagesService } from '../services/state/request-stages.service';
import { RequestDetailComponentsModule } from './request-detail-components.module';

@NgModule({
  imports: [CommonModule, RequestDetailComponentsModule],
  providers: [
    { provide: RequestStagesService, useClass: RequestAllocationStagesConcreteService },
    { provide: StageDetailService, useClass: AllocationStageDetailPollingService },
  ],
})
export class AllocationRequestDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<AllocationRequestDetailComponentsModule> {
    return {
      ngModule: AllocationRequestDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
