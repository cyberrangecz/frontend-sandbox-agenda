import { ResourcesPageMaterialModule } from './resources-page-material.module';
import { ResourcesPageComponent } from './resources-page.component';
import { VMImageDetailComponent } from './vm-image-detail/vm-image-detail.component';
import { QuotaPieChartComponent } from './quotas/quota-pie-chart/quota-pie-chart.component';
import { SandboxResourcesConcreteService } from '../services/sandbox-resources-concrete.service';
import { SandboxAgendaConfig } from '@kypo/sandbox-agenda';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxResourcesService } from '../services/sandbox-resources.service';
import { QuotasComponent } from './quotas/quotas.component';
import { SentinelTableModule } from '@sentinel/components/table';
import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { VMImagesService } from '../services/vm-images.service';
import { VMImagesConcreteService } from '../services/vm-images-concrete.service';

@NgModule({
  declarations: [ResourcesPageComponent, QuotaPieChartComponent, QuotasComponent, VMImageDetailComponent],
  imports: [CommonModule, ResourcesPageMaterialModule, SentinelTableModule],
  providers: [
    SandboxAgendaContext,
    { provide: SandboxResourcesService, useClass: SandboxResourcesConcreteService },
    { provide: VMImagesService, useClass: VMImagesConcreteService },
  ],
})
export class ResourcesPageModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<ResourcesPageModule> {
    return {
      ngModule: ResourcesPageModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
