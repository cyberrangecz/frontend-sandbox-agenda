import { NgModule } from '@angular/core';
import { PoolAllocationRequestDetailComponentsModule } from '../../../../../../../kypo-sandbox-agenda/src/lib/components/pool-request/pool-allocation-request-detail-components.module';
import { PoolRequestDetailRoutingModule } from './pool-request-detail-routing.module';

@NgModule({
  imports: [PoolAllocationRequestDetailComponentsModule, PoolRequestDetailRoutingModule],
})
export class PoolAllocationRequestDetailModule {}
