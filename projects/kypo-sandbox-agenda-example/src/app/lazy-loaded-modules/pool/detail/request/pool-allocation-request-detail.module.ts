import { NgModule } from '@angular/core';
import { AllocationRequestDetailComponentsModule } from 'kypo-sandbox-agenda/request-detail';
import { PoolRequestDetailRoutingModule } from './pool-request-detail-routing.module';

@NgModule({
  imports: [AllocationRequestDetailComponentsModule, PoolRequestDetailRoutingModule],
})
export class PoolAllocationRequestDetailModule {}
