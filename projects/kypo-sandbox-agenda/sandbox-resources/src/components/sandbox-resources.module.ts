import { QuotaPieChartComponent } from './quotas/quota-pie-chart/quota-pie-chart.component';
import { SandboxResourcesConcreteService } from './../services/sandbox-resources-concrete.service';
import { SandboxResourcesMaterialModule } from './sandbox-resources-material.module';
import { SandboxResourcesComponent } from './sandbox-resources.component';
import { SandboxAgendaConfig } from 'kypo-sandbox-agenda';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxResourcesService } from '../services/sandbox-resources.service';
import { QuotasComponent } from './quotas/quotas.component';

@NgModule({
  declarations: [SandboxResourcesComponent, QuotaPieChartComponent, QuotasComponent],
  imports: [CommonModule, SandboxResourcesMaterialModule],
  providers: [{ provide: SandboxResourcesService, useClass: SandboxResourcesConcreteService }],
})
export class SandboxResourcesModule {
  static forRoot(config: SandboxAgendaConfig): ModuleWithProviders<SandboxResourcesModule> {
    return {
      ngModule: SandboxResourcesModule,
      providers: [{ provide: SandboxAgendaConfig, useValue: config }],
    };
  }
}
