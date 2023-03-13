import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  exports: [SpinnerComponent]
})
export class SpinnerModulo {
}
