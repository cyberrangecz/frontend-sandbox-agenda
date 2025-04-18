import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { SandboxAgendaConfig, SandboxDefaultNavigator, SandboxNavigator } from '@crczp/sandbox-agenda';
import { SandboxAgendaContext } from '@crczp/sandbox-agenda/internal';
import { SandboxDefinitionEditConcreteService } from '../services/sandbox-definition-edit-concrete.service';
import { SandboxDefinitionEditService } from '../services/sandbox-definition-edit.service';
import { CreateSandboxDefinitionMaterial } from './sandbox-definition-edit-material.module';
import { SandboxDefinitionEditComponent } from './sandbox-definition-edit.component';

/**
 * Module for create sandbox definition page and components
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CreateSandboxDefinitionMaterial,
        SentinelControlsComponent,
    ],
    declarations: [SandboxDefinitionEditComponent],
    providers: [
        SandboxAgendaContext,
        { provide: SandboxNavigator, useClass: SandboxDefaultNavigator },
        { provide: SandboxDefinitionEditService, useClass: SandboxDefinitionEditConcreteService },
    ],
})
export class SandboxDefinitionEditComponentsModule {
    static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxDefinitionEditComponentsModule> {
        return {
            ngModule: SandboxDefinitionEditComponentsModule,
            providers: [{ provide: SandboxAgendaConfig, useValue: config }],
        };
    }
}
