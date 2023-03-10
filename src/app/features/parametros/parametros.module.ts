import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosEspecificosComponent } from './parametros-especificos/parametros-especificos.component';
import { ParametrosComunesComponent } from './parametros-comunes/parametros-comunes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedPrimeNgModule } from 'app/shared/SharedPrimeNg.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModulo } from 'app/shared/components/spinner/spinner.module';
import {
  ParametrosComunesPendientesComponent
} from './parametros-comunes-pendientes/parametros-comunes-pendientes.component';


@NgModule({
  declarations: [
    ParametrosEspecificosComponent,
    ParametrosComunesComponent,
    ParametrosComunesPendientesComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedPrimeNgModule,
    RadioButtonModule,
    CheckboxModule,
    DialogModule,
    PaginatorModule,
    RouterModule,
    HttpClientModule,
    SpinnerModulo,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ParametrosEspecificosComponent,
    ParametrosComunesComponent
  ]
})
export class ParametrosModule {
}
