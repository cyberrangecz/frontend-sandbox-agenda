import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SandboxAgendaConfig } from '../../model/client/sandbox-agenda-config';
import { CleanupStageDetailPollingService } from '../../services/stage/detail/cleanup-stage-detail-polling.service';
import { StageDetailService } from '../../services/stage/detail/stage-detail.service';
import { RequestCleanupStagesConcreteService } from '../../services/stage/request-cleanup-stages-concrete.service';
import { RequestStagesService } from '../../services/stage/request-stages.service';
import { PoolRequestDetailComponentsModule } from './pool-request-detail-components.module';

@NgModule({
  imports: [CommonModule, PoolRequestDetailComponentsModule],
  providers: [
    { provide: RequestStagesService, useClass: RequestCleanupStagesConcreteService },
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
