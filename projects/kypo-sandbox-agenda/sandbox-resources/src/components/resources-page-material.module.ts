import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Material components import for create sandbox resources module
 */
@NgModule({
  imports: [MatCardModule, MatCheckboxModule],
  exports: [MatCardModule, MatCheckboxModule],
})
export class ResourcesPageMaterialModule {}
