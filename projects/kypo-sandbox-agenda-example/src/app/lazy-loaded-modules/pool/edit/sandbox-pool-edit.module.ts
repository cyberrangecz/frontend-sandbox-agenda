import { NgModule } from '@angular/core';
import { SandboxPoolEditComponentsModule } from '../../../../../../kypo-sandbox-agenda/src/lib/components/pool/edit/sandbox-pool-edit-components.module';
import { SandboxPoolEditRoutingModule } from './sandbox-pool-edit-routing.module';

@NgModule({
  imports: [SandboxPoolEditComponentsModule, SandboxPoolEditRoutingModule],
})
export class SandboxPoolEditModule {}
