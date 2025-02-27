import { NgModule } from '@angular/core';
import { PoolEditComponentsModule } from '@crczp/sandbox-agenda/pool-edit';
import { SandboxPoolEditRoutingModule } from './sandbox-pool-edit-routing.module';

@NgModule({
    imports: [PoolEditComponentsModule, SandboxPoolEditRoutingModule],
})
export class SandboxPoolEditModule {}
