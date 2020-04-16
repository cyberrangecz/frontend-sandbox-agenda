import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { KypoControlsModule } from 'kypo-controls';
import { Kypo2TableModule } from 'kypo2-table';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { PoolAllocationRequestsConcreteService } from '../../../services/pool-request/allocation/pool-allocation-requests-concrete.service';
import { PoolAllocationRequestsPollingService } from '../../../services/pool-request/allocation/pool-allocation-requests-polling.service';
import { PoolCleanupRequestsConcreteService } from '../../../services/pool-request/cleanup/pool-cleanup-requests-concrete.service';
import { PoolCleanupRequestsPollingService } from '../../../services/pool-request/cleanup/pool-cleanup-requests-polling.service';
import { PoolRequestBreadcrumbResolver } from '../../../services/resolvers/pool-request-breadcrumb-resolver.service';
import { PoolRequestResolver } from '../../../services/resolvers/pool-request-resolver.service';
import { PoolResolver } from '../../../services/resolvers/pool-resolver.service';
import { SandboxInstanceBreadcrumbResolver } from '../../../services/resolvers/sandbox-instance-breadcrumb-resolver.service';
import { SandboxInstanceResolver } from '../../../services/resolvers/sandbox-instance-resolver.service';
import { SandboxInstanceConcreteService } from '../../../services/sandbox-instance/sandbox-instance-concrete.service';
import { SandboxInstanceService } from '../../../services/sandbox-instance/sandbox-instance.service';
import { SandboxPoolDetailMaterialModule } from './sandbox-pool-detail-material.module';
import { SandboxPoolDetailComponent } from './sandbox-pool-detail.component';

/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [SandboxPoolDetailComponent],
  imports: [CommonModule, Kypo2TableModule, SandboxPoolDetailMaterialModule, KypoControlsModule],
  providers: [
    PoolResolver,
    PoolRequestResolver,
    PoolRequestBreadcrumbResolver,
    SandboxInstanceResolver,
    SandboxInstanceBreadcrumbResolver,
    { provide: PoolAllocationRequestsPollingService, useClass: PoolAllocationRequestsConcreteService },
    { provide: PoolCleanupRequestsPollingService, useClass: PoolCleanupRequestsConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
  ],
})
export class SandboxPoolDetailComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxPoolDetailComponentsModule> {
    return {
      ngModule: SandboxPoolDetailComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
