import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

/**
 * Material components imports for sandbox pool detail module
 */
@NgModule({
  imports: [MatButtonModule, MatDialogModule],
  exports: [MatButtonModule, MatDialogModule],
})
export class SandboxPoolDetailMaterialModule {}
