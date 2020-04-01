import {NgModule} from '@angular/core';
import {SandboxInstanceTopologyComponentsModule} from 'kypo-sandbox-agenda';
import {SandboxInstanceTopologyRoutingModule} from './sandbox-instance-topology-routing.module';

@NgModule({
  imports: [
    SandboxInstanceTopologyComponentsModule,
    SandboxInstanceTopologyRoutingModule
  ]
})
export class SandboxInstanceTopologyModule {

}
