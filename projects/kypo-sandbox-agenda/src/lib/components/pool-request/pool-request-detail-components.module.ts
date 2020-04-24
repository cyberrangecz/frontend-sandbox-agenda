import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KypoPipesModule } from 'kypo-common';
import { KypoListModule } from 'kypo-list';
import { PoolRequestResolver } from '../../services/resolvers/pool-request-resolver.service';
import { PoolResolver } from '../../services/resolvers/pool-resolver.service';
import { PoolRequestDetailMaterialModule } from './pool-request-detail-material.module';
import { PoolRequestDetailComponent } from './pool-request-detail.component';
import { AllocationAnsibleStageOutputComponent } from './stage/detail/ansible-allocation-stage-detail/allocation-ansible-stage-output/allocation-ansible-stage-output.component';
import { AnsibleAllocationStageDetailComponent } from './stage/detail/ansible-allocation-stage-detail/ansible-allocation-stage-detail.component';
import { CleanupStageDetailComponent } from './stage/detail/cleanup-stage-detail/cleanup-stage-detail.component';
import { OpenstackAllocationStageDetailComponent } from './stage/detail/openstack-allocation-stage-detail/openstack-allocation-stage-detail.component';
import { RequestStageDetailComponent } from './stage/detail/request-stage-detail.component';
import { RequestStageCommonComponent } from './stage/header/request-stage-common.component';
import { RequestStageComponent } from './stage/request-stage.component';

/**
 * Contains components and providers for pool request detail page
 */
@NgModule({
  imports: [CommonModule, PoolRequestDetailMaterialModule, KypoPipesModule, KypoListModule],
  declarations: [
    PoolRequestDetailComponent,
    RequestStageComponent,
    RequestStageCommonComponent,
    RequestStageDetailComponent,
    AnsibleAllocationStageDetailComponent,
    AllocationAnsibleStageOutputComponent,
    OpenstackAllocationStageDetailComponent,
    CleanupStageDetailComponent,
  ],
  providers: [PoolResolver, PoolRequestResolver],
})
export class PoolRequestDetailComponentsModule {}
