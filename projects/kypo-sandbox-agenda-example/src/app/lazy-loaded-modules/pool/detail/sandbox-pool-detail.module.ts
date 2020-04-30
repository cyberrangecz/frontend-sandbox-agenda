import { NgModule } from '@angular/core';
import { SandboxPoolDetailComponentsModule } from '../../../../../../kypo-sandbox-agenda/src/lib/components/pool/detail/sandbox-pool-detail-components.module';
import { SandboxPoolDetailRoutingModule } from './sandbox-pool-detail-routing.module';

@NgModule({
  imports: [SandboxPoolDetailComponentsModule, SandboxPoolDetailRoutingModule],
})
export class SandboxPoolDetailModule {}
