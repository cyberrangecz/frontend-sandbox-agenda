import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { SentinelListComponent } from '@sentinel/components/list';
import { SandboxAgendaConfig } from '@muni-kypo-crp/sandbox-agenda';
import { PoolEditConcreteService } from '../services/pool-edit-concrete.service';
import { PoolEditService } from '../services/pool-edit.service';
import { SandboxDefinitionSelectComponent } from './sandbox-definition-select/sandbox-definition-select.component';
import { PoolEditMaterialModule } from './pool-edit-material.module';
import { PoolEditComponent } from './pool-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [PoolEditComponent, SandboxDefinitionSelectComponent],
  imports: [
    CommonModule,
    PoolEditMaterialModule,
    SentinelControlsComponent,
    SentinelListComponent,
    ReactiveFormsModule,
    MatTooltipModule,
    MatGridListModule,
  ],
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
