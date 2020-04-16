import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatDividerModule, MatDialogModule],
  exports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatDividerModule, MatDialogModule],
})
export class SandboxPoolEditMaterialModule {}
