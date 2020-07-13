import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SentinelPipesModule } from '@sentinel/common';
import { SentinelListModule } from '@sentinel/components/list';
import { PoolResolver, RequestResolver } from 'kypo-sandbox-agenda/resolvers';
import { RequestDetailMaterialModule } from './request-detail-material.module';
import { RequestDetailComponent } from './request-detail.component';
import { AnsibleAllocationStageDetailComponent } from './stage/detail/ansible-allocation-stage-detail/ansible-allocation-stage-detail.component';
import { CleanupStageDetailComponent } from './stage/detail/cleanup-stage-detail/cleanup-stage-detail.component';
import { OpenstackAllocationStageDetailComponent } from './stage/detail/openstack-allocation-stage-detail/openstack-allocation-stage-detail.component';
import { RequestStageDetailComponent } from './stage/detail/request-stage-detail.component';
import { RequestStageCommonComponent } from './stage/header/request-stage-common.component';
import { RequestStageComponent } from './stage/request-stage.component';
import { SentinelCodeViewerModule } from '@sentinel/components/code-viewer';

/**
 * Contains components and providers for pool request detail page
 */
@NgModule({
  imports: [
    CommonModule,
    RequestDetailMaterialModule,
    SentinelPipesModule,
    SentinelListModule,
    SentinelCodeViewerModule,
  ],
  declarations: [
    RequestDetailComponent,
    RequestStageComponent,
    RequestStageCommonComponent,
    RequestStageDetailComponent,
    AnsibleAllocationStageDetailComponent,
    OpenstackAllocationStageDetailComponent,
    CleanupStageDetailComponent,
  ],
  providers: [PoolResolver, RequestResolver],
})
export class RequestDetailComponentsModule {}
