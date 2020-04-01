import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditSandboxDefinitionComponent} from './edit-sandbox-definition.component';
import {CreateSandboxDefinitionMaterial} from './edit-sandbox-definition-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SandboxDefinitionDetailService} from '../../../services/sandbox-definition/detail/sandbox-definition-detail.service';
import {SandboxDefinitionDetailConcreteService} from '../../../services/sandbox-definition/detail/sandbox-definition-detail-concrete.service';
import {KypoControlsModule} from 'kypo-controls';
import {SandboxNavigator} from '../../../services/client/sandbox-navigator.service';
import {SandboxDefaultNavigator} from '../../../services/client/sandbox-default-navigator.service';
import {SandboxAgendaConfig} from '../../../model/client/sandbox-agenda-config';
import {SandboxAgendaContext} from '../../../services/internal/sandox-agenda-context.service';

/**
 * Module for create sandbox definition page and components
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateSandboxDefinitionMaterial,
    KypoControlsModule
  ],
  declarations: [
    EditSandboxDefinitionComponent
  ],
  providers: [
    SandboxAgendaContext,
    {provide: SandboxNavigator, useClass: SandboxDefaultNavigator},
    {provide: SandboxDefinitionDetailService, useClass: SandboxDefinitionDetailConcreteService}
  ]
})
export class EditSandboxDefinitionComponentsModule {

  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<EditSandboxDefinitionComponentsModule> {
    return {
      ngModule: EditSandboxDefinitionComponentsModule,
      providers: [
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
