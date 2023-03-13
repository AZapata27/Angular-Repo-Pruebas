import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { EjecucionProcesosComponent } from './ejecucion-procesos/ejecucion-procesos.component';
import {
  ResultadoEjecucionProcesosComponent
} from './resultado-ejecucion-procesos/resultado-ejecucion-procesos.component';
import { DialogInformacionEjecucionProcesoComponent } from './resultado-ejecucion-procesos/dialog-informacion-ejecucion-proceso.component';
import {
  ConsultaProcesosProgramadosComponent
} from './consulta-procesos-programados/consulta-procesos-programados.component';
import { DefinicionProcesosComponent } from './definicion-procesos/definicion-procesos.component';
import { DialogSubprocesosComponent } from './consulta-procesos-programados/dialog-subprocesos.component';

import { CreditosEspecificosComponent } from "./creditos-especificos/creditos-especificos.component";

@NgModule({
  declarations: [
    ConsultaProcesosProgramadosComponent,
    DefinicionProcesosComponent,
    EjecucionProcesosComponent,
    ResultadoEjecucionProcesosComponent,
    CreditosEspecificosComponent,
    DialogInformacionEjecucionProcesoComponent,
    DialogSubprocesosComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ProcesosModule {
}
