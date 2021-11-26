import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Material components imports for sandbox pool detail module
 */
@NgModule({
  imports: [MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatRippleModule, MatTooltipModule],
  exports: [MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatRippleModule, MatTooltipModule],
})
export class PoolDetailMaterialModule {}
