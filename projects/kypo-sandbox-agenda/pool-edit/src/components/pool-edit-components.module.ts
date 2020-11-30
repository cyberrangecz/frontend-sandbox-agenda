import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelListModule } from '@sentinel/components/list';
import { SandboxAgendaConfig } from '@kypo/sandbox-agenda';
import { PoolEditConcreteService } from '../services/pool-edit-concrete.service';
import { PoolEditService } from '../services/pool-edit.service';
import { SandboxDefinitionSelectComponent } from './sandbox-definition-select/sandbox-definition-select.component';
import { PoolEditMaterialModule } from './pool-edit-material.module';
import { PoolEditComponent } from './pool-edit.component';

@NgModule({
  declarations: [PoolEditComponent, SandboxDefinitionSelectComponent],
  imports: [CommonModule, PoolEditMaterialModule, SentinelControlsModule, SentinelListModule, ReactiveFormsModule],
  providers: [{ provide: PoolEditService, useClass: PoolEditConcreteService }],
})
export class PoolEditComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<PoolEditComponentsModule> {
    return {
      ngModule: PoolEditComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
