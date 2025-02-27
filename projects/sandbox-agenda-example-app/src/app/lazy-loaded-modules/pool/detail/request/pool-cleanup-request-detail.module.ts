import { NgModule } from '@angular/core';
import { CleanupRequestDetailComponentsModule } from '@crczp/sandbox-agenda/request-detail';
import { PoolCleanupRequestDetailRoutingModule } from './pool-cleanup-request-detail-routing.module';

@NgModule({
    imports: [CleanupRequestDetailComponentsModule, PoolCleanupRequestDetailRoutingModule],
})
export class PoolCleanupRequestDetailModule {}
