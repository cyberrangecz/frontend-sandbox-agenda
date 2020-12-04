import { NgModule } from '@angular/core';
import { PoolEditComponentsModule } from '@muni-kypo-crp/sandbox-agenda/pool-edit';
import { SandboxPoolEditRoutingModule } from './sandbox-pool-edit-routing.module';

@NgModule({
  imports: [PoolEditComponentsModule, SandboxPoolEditRoutingModule],
})
export class SandboxPoolEditModule {}
