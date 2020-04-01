import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {Kypo2TableModule} from 'kypo2-table';

import {SandboxPoolDetailMaterialModule} from './sandbox-pool-detail-material.module';
import {SandboxPoolDetailComponent} from './sandbox-pool-detail.component';
import {KypoControlsModule} from 'kypo-controls';
import {PoolResolver} from '../../../services/resolvers/pool-resolver.service';
import {PoolRequestResolver} from '../../../services/resolvers/pool-request-resolver.service';
import {PoolRequestBreadcrumbResolver} from '../../../services/resolvers/pool-request-breadcrumb-resolver.service';
import {SandboxInstanceResolver} from '../../../services/resolvers/sandbox-instance-resolver.service';
import {SandboxInstanceBreadcrumbResolver} from '../../../services/resolvers/sandbox-instance-breadcrumb-resolver.service';
import {PoolAllocationRequestsPollingService} from '../../../services/pool-request/allocation/pool-allocation-requests-polling.service';
import {PoolCleanupRequestsPollingService} from '../../../services/pool-request/cleanup/pool-cleanup-requests-polling.service';
import {SandboxInstanceService} from '../../../services/sandbox-instance/sandbox-instance.service';
import {SandboxInstanceConcreteService} from '../../../services/sandbox-instance/sandbox-instance-concrete.service';
import {PoolCleanupRequestsConcreteService} from '../../../services/pool-request/cleanup/pool-cleanup-requests-concrete.service';
import {PoolAllocationRequestsConcreteService} from '../../../services/pool-request/allocation/pool-allocation-requests-concrete.service';
/**
 * Module containing component and providers for sandbox pool detail page
 */
@NgModule({
  declarations: [SandboxPoolDetailComponent],
    imports: [
      CommonModule,
      Kypo2TableModule,
      SandboxPoolDetailMaterialModule,
      KypoControlsModule,
    ],
  providers: [
    PoolResolver,
    PoolRequestResolver,
    PoolRequestBreadcrumbResolver,
    SandboxInstanceResolver,
    SandboxInstanceBreadcrumbResolver,
    { provide: PoolAllocationRequestsPollingService, useClass: PoolAllocationRequestsConcreteService},
    { provide: PoolCleanupRequestsPollingService, useClass: PoolCleanupRequestsConcreteService },
    { provide: SandboxInstanceService, useClass: SandboxInstanceConcreteService },
  ]
})
export class SandboxInstanceOverviewModule { }
