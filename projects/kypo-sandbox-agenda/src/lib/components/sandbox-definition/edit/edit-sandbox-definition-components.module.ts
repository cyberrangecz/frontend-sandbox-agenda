import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { SandboxDefaultNavigator } from '../../../services/client/sandbox-default-navigator.service';
import { SandboxNavigator } from '../../../services/client/sandbox-navigator.service';
import { SandboxAgendaContext } from '../../../services/internal/sandox-agenda-context.service';
import { SandboxDefinitionDetailConcreteService } from '../../../services/sandbox-definition/detail/sandbox-definition-detail-concrete.service';
import { SandboxDefinitionDetailService } from '../../../services/sandbox-definition/detail/sandbox-definition-detail.service';
import { CreateSandboxDefinitionMaterial } from './edit-sandbox-definition-material.module';
import { EditSandboxDefinitionComponent } from './edit-sandbox-definition.component';

/**
 * Module for create sandbox definition page and components
 */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CreateSandboxDefinitionMaterial, SentinelControlsModule],
  declarations: [EditSandboxDefinitionComponent],
  providers: [
    SandboxAgendaContext,
    { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
    { provide: SandboxDefinitionDetailService, useClass: SandboxDefinitionDetailConcreteService },
  ],
})
export class EditSandboxDefinitionComponentsModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<EditSandboxDefinitionComponentsModule> {
    return {
      ngModule: EditSandboxDefinitionComponentsModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
