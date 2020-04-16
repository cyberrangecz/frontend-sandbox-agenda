import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KypoControlsModule } from 'kypo-controls';
import { KypoListModule } from 'kypo-list';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { PoolEditConcreteService } from '../../../services/pool/pool-edit-concrete.service';
import { PoolEditService } from '../../../services/pool/pool-edit.service';
import { SandboxDefinitionSelectComponent } from './sandbox-definition-select/sandbox-definition-select.component';
import { SandboxPoolEditMaterialModule } from './sandbox-pool-edit-material.module';
import { SandboxPoolEditComponent } from './sandbox-pool-edit.component';

@NgModule({
  declarations: [SandboxPoolEditComponent, SandboxDefinitionSelectComponent],
  imports: [CommonModule, SandboxPoolEditMaterialModule, KypoControlsModule, KypoListModule, ReactiveFormsModule],
  providers: [{ provide: PoolEditService, useClass: PoolEditConcreteService }],
})
export class SandboxPoolEditComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxPoolEditComponentsModule> {
    return {
      ngModule: SandboxPoolEditComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
