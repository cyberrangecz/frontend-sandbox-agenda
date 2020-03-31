import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSandboxDefinitionComponent} from './create-sandbox-definition.component';
import {CreateSandboxDefinitionMaterial} from './create-sandbox-definition-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SandboxDefinitionDetailService} from '../../../services/sandbox-definition/detail/sandbox-definition-detail.service';
import {SandboxDefinitionDetailConcreteService} from '../../../services/sandbox-definition/detail/sandbox-definition-detail-concrete.service';
import {KypoControlsModule} from 'kypo-controls';
import {SandboxNavigator} from '../../../services/client/sandbox-navigator.service';
import {SandboxDefaultNavigator} from '../../../services/client/sandbox-default-navigator.service';
import {SandboxAgendaConfig} from '../../../model/sandbox-agenda-config';
import {KypoSandboxAgendaContext} from '../../../services/internal/sandox-agenda-context.service';

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
    CreateSandboxDefinitionComponent
  ],
  providers: [
    KypoSandboxAgendaContext,
    {provide: SandboxNavigator, useClass: SandboxDefaultNavigator},
    {provide: SandboxDefinitionDetailService, useClass: SandboxDefinitionDetailConcreteService}
  ]
})
export class CreateSandboxDefinitionComponentsModule {
  constructor(@Optional() @SkipSelf() parentModule: CreateSandboxDefinitionComponentsModule) {
    if (parentModule) {
      throw new Error(
        'CreateSandboxDefinitionComponentsModule is already loaded. Import it only once');
    }
  }

  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<CreateSandboxDefinitionComponentsModule> {
    return {
      ngModule: CreateSandboxDefinitionComponentsModule,
      providers: [
        {provide: SandboxAgendaConfig, useValue: config},
      ]
    };
  }
}
