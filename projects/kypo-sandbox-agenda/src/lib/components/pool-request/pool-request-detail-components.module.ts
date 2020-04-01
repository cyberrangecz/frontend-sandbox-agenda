import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PoolRequestDetailMaterialModule} from './pool-request-detail-material.module';
import {PoolRequestDetailComponent} from './pool-request-detail.component';
import {KypoPipesModule} from 'kypo-common';
import {RequestStageComponent} from './stage/request-stage.component';
import {RequestStageCommonComponent} from './stage/header/request-stage-common.component';
import {RequestStageDetailComponent} from './stage/detail/request-stage-detail.component';
import {AnsibleAllocationStageDetailComponent} from './stage/detail/ansible-allocation-stage-detail/ansible-allocation-stage-detail.component';
import {OpenstackAllocationStageDetailComponent} from './stage/detail/openstack-allocation-stage-detail/openstack-allocation-stage-detail.component';
import {CleanupStageDetailComponent} from './stage/detail/cleanup-stage-detail/cleanup-stage-detail.component';
import {PoolResolver} from '../../services/resolvers/pool-resolver.service';
import {PoolRequestResolver} from '../../services/resolvers/pool-request-resolver.service';
import {PoolRequestTypeResolver} from '../../services/resolvers/pool-request-type-resolver.service';

/**
 * Contains components and providers for pool request detail page
 */
@NgModule({
  imports: [
    CommonModule,
    PoolRequestDetailMaterialModule,
    KypoPipesModule
  ],
  declarations: [
    PoolRequestDetailComponent,
    RequestStageComponent,
    RequestStageCommonComponent,
    RequestStageDetailComponent,
    AnsibleAllocationStageDetailComponent,
    OpenstackAllocationStageDetailComponent,
    CleanupStageDetailComponent
  ],
  providers: [
    PoolResolver,
    PoolRequestResolver,
    PoolRequestTypeResolver,
  ],
})
export class PoolRequestDetailComponentsModule {
}
