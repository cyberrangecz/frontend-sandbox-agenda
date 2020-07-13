import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaConfig } from 'kypo-sandbox-agenda';
import { AllocationRequestsConcreteService } from '../services/state/request/allocation/allocation-requests-concrete.service';
import { AllocationRequestsService } from '../services/state/request/allocation/allocation-requests.service';
import { CleanupRequestsConcreteService } from '../services/state/request/cleanup/cleanup-requests-concrete.service';
import { CleanupRequestsService } from '../services/state/request/cleanup/cleanup-requests.service';
import {
  SandboxInstanceResolver,
  SandboxInstanceBreadcrumbResolver,
  PoolResolver,
  RequestResolver,
  RequestBreadcrumbResolver,
} from 'kypo-sandbox-agenda/resolvers';
import { SandboxInstanceConcreteService } from '../services/state/sandbox-instance/sandbox-instance-concrete.service';
import { SandboxInstanceService } from '../services/state/sandbox-instance/sandbox-instance.service';
import { PoolDetailMaterialModule } from './pool-detail-material.module';
import { PoolDetailComponent } from './pool-detail.component';

/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [PoolDetailComponent],
  imports: [CommonModule, SentinelTableModule, PoolDetailMaterialModule, SentinelControlsModule],
  providers: [
    PoolResolver,
    RequestResolver,
    RequestBreadcrumbResolver,
    SandboxInstanceResolver,
    SandboxInstanceBreadcrumbResolver,
    { provide: AllocationRequestsService, useClass: AllocationRequestsConcreteService },
    { provide: CleanupRequestsService, useClass: CleanupRequestsConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
  ],
})
export class PoolDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolDetailComponentsModule> {
    return {
      ngModule: PoolDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
