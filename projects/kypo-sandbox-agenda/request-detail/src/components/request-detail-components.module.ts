import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SentinelPipesModule } from '@sentinel/common';
import { SentinelListModule } from '@sentinel/components/list';
import { PoolResolver, RequestResolver } from '@muni-kypo-crp/sandbox-agenda/resolvers';
import { RequestDetailMaterialModule } from './request-detail-material.module';
import { RequestStageDetailComponent } from './stage/detail/request-stage-detail.component';
import { RequestStageHeaderComponent } from './stage/header/request-stage-header.component';
import { RequestStageComponent } from './stage/request-stage.component';
import { SentinelCodeViewerModule } from '@sentinel/components/code-viewer';
import { TerraformAllocationStageDetailComponent } from './stage/detail/terraform-allocation-stage-detail/terraform-allocation-stage-detail.component';
import { AnsibleAllocationStageDetailComponent } from './stage/detail/ansible-allocation-stage-detail/ansible-allocation-stage-detail.component';

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
    RequestStageComponent,
    RequestStageHeaderComponent,
    RequestStageDetailComponent,
    TerraformAllocationStageDetailComponent,
    AnsibleAllocationStageDetailComponent,
  ],
  providers: [PoolResolver, RequestResolver],
  exports: [RequestStageComponent, RequestDetailMaterialModule],
})
export class RequestDetailComponentsModule {}
