import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SandboxAgendaConfig } from 'kypo-sandbox-agenda';
import { CleanupStageDetailPollingService } from '../services/state/detail/cleanup-stage-detail-polling.service';
import { StageDetailService } from '../services/state/detail/stage-detail.service';
import { RequestCleanupStagesConcreteService } from '../services/state/request-cleanup-stages-concrete.service';
import { RequestStagesService } from '../services/state/request-stages.service';
import { RequestDetailComponentsModule } from './request-detail-components.module';

@NgModule({
  imports: [CommonModule, RequestDetailComponentsModule],
  providers: [
    { provide: RequestStagesService, useClass: RequestCleanupStagesConcreteService },
    { provide: StageDetailService, useClass: CleanupStageDetailPollingService },
  ],
})
export class CleanupRequestDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<CleanupRequestDetailComponentsModule> {
    return {
      ngModule: CleanupRequestDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
