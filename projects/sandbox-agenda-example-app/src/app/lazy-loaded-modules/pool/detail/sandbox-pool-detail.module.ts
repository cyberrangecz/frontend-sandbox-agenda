import { NgModule } from '@angular/core';
import { PoolDetailComponentsModule } from '@crczp/sandbox-agenda/pool-detail';
import { SandboxPoolDetailRoutingModule } from './sandbox-pool-detail-routing.module';

@NgModule({
    imports: [PoolDetailComponentsModule, SandboxPoolDetailRoutingModule],
})
export class SandboxPoolDetailModule {}
