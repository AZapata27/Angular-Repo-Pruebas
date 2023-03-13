import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ParametrosEspecificosComponent } from './parametros-especificos/parametros-especificos.component';
import { ParametrosComunesComponent } from './parametros-comunes/parametros-comunes.component';
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
    SharedModule,
  ]
})
export class ParametrosModule {
}
