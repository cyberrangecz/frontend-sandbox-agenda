import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { KypoControlsModule } from 'kypo-controls';
import { Kypo2TableModule } from 'kypo2-table';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { AllocationRequestsConcreteService } from '../../../services/request/allocation/allocation-requests-concrete.service';
import { AllocationRequestsService } from '../../../services/request/allocation/allocation-requests.service';
import { CleanupRequestsConcreteService } from '../../../services/request/cleanup/cleanup-requests-concrete.service';
import { CleanupRequestsService } from '../../../services/request/cleanup/cleanup-requests.service';
import { PoolRequestBreadcrumbResolver } from '../../../services/resolvers/pool-request-breadcrumb-resolver.service';
import { PoolRequestResolver } from '../../../services/resolvers/pool-request-resolver.service';
import { PoolResolver } from '../../../services/resolvers/pool-resolver.service';
import { SandboxInstanceBreadcrumbResolver } from '../../../services/resolvers/sandbox-instance-breadcrumb-resolver.service';
import { SandboxInstanceResolver } from '../../../services/resolvers/sandbox-instance-resolver.service';
import { SandboxInstanceConcreteService } from '../../../services/sandbox-instance/sandbox-instance-concrete.service';
import { SandboxInstanceService } from '../../../services/sandbox-instance/sandbox-instance.service';
import { SandboxPoolDetailMaterialModule } from './sandbox-pool-detail-material.module';
import { PoolDetailComponent } from './pool-detail.component';

/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [PoolDetailComponent],
  imports: [CommonModule, Kypo2TableModule, SandboxPoolDetailMaterialModule, KypoControlsModule],
  providers: [
    PoolResolver,
    PoolRequestResolver,
    PoolRequestBreadcrumbResolver,
    SandboxInstanceResolver,
    SandboxInstanceBreadcrumbResolver,
    { provide: AllocationRequestsService, useClass: AllocationRequestsConcreteService },
    { provide: CleanupRequestsService, useClass: CleanupRequestsConcreteService },
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
