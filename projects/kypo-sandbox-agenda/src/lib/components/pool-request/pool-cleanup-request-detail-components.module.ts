import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SandboxAgendaConfig } from '../../model/client/sandbox-agenda-config';
import { CleanupStageDetailPollingService } from '../../services/stage/detail/cleanup-stage-detail-polling.service';
import { StageDetailService } from '../../services/stage/detail/stage-detail.service';
import { RequestCleanupStagesPollingService } from '../../services/stage/request-cleanup-stages-polling.service';
import { RequestStagesPollingService } from '../../services/stage/request-stages-polling.service';
import { PoolRequestDetailComponentsModule } from './pool-request-detail-components.module';

@NgModule({
  imports: [CommonModule, PoolRequestDetailComponentsModule],
  providers: [
    { provide: RequestStagesPollingService, useClass: RequestCleanupStagesPollingService },
    { provide: StageDetailService, useClass: CleanupStageDetailPollingService },
  ],
})
export class PoolCleanupRequestDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolCleanupRequestDetailComponentsModule> {
    return {
      ngModule: PoolCleanupRequestDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
