import { NgModule } from '@angular/core';
import { PoolCleanupRequestDetailComponentsModule } from '../../../../../../../kypo-sandbox-agenda/src/lib/components/pool-request/pool-cleanup-request-detail-components.module';
import { PoolRequestDetailRoutingModule } from './pool-request-detail-routing.module';

@NgModule({
  imports: [PoolCleanupRequestDetailComponentsModule, PoolRequestDetailRoutingModule],
})
export class PoolCleanupRequestDetailModule {}
