import { ImagesPageMaterialModule } from './images-page-material.module';
import { ImagesPageComponent } from './images-page.component';
import { VMImageDetailComponent } from './vm-image-detail/vm-image-detail.component';
import { SandboxAgendaConfig } from '@cyberrangecz-platform/sandbox-agenda';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentinelTableModule } from '@sentinel/components/table';
import { PaginationService, SandboxAgendaContext } from '@cyberrangecz-platform/sandbox-agenda/internal';
import { VMImagesService } from '../services/vm-images.service';
import { VMImagesConcreteService } from '../services/vm-images-concrete.service';

@NgModule({
  declarations: [ImagesPageComponent, VMImageDetailComponent],
  imports: [CommonModule, ImagesPageMaterialModule, SentinelTableModule],
  providers: [
    PaginationService,
    SandboxAgendaContext,
    {
      provide: VMImagesService,
      useClass: VMImagesConcreteService,
    },
  ],
})
export class ImagesPageModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<ImagesPageModule> {
    return {
      ngModule: ImagesPageModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
