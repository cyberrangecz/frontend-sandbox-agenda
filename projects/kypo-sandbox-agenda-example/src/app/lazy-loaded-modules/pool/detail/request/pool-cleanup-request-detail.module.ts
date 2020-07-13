import { NgModule } from '@angular/core';
import { CleanupRequestDetailComponentsModule } from 'kypo-sandbox-agenda/request-detail';
import { PoolRequestDetailRoutingModule } from './pool-request-detail-routing.module';

@NgModule({
  imports: [CleanupRequestDetailComponentsModule, PoolRequestDetailRoutingModule],
})
export class PoolCleanupRequestDetailModule {}
