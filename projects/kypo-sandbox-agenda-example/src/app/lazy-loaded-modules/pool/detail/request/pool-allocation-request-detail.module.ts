import { NgModule } from '@angular/core';
import { AllocationRequestDetailComponentsModule } from '@cyberrangecz-platform/sandbox-agenda/request-detail';
import { PoolAllocationRequestDetailRoutingModule } from './pool-allocation-request-detail-routing.module';

@NgModule({
  imports: [AllocationRequestDetailComponentsModule, PoolAllocationRequestDetailRoutingModule],
})
export class PoolAllocationRequestDetailModule {}
