// Centrales

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Compartidos
import { SharedPrimeNgModule } from 'app/shared/SharedPrimeNg.module';

//PrimeNg:
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';

// De funciones
import { SpinnerModulo } from 'app/shared/components/spinner/spinner.module';
import { EjecucionProcesosPageComponent } from './ejecucion-procesos-page/ejecucion-procesos-page.component';
import {
  ResultadoEjecucionProcesosPageComponent
} from './resultado-ejecucion-procesos-page/resultado-ejecucion-procesos-page.component';
import { DialogInformacionProcesos } from './resultado-ejecucion-procesos-page/DialogInformacionProcesos';
import {
  ConsultaProcesosProgramadosPageComponent
} from './consulta-procesos-programados-page/consulta-procesos-programados-page.component';
import { DefinicionProcesosPageComponent } from './definicion-procesos-page/definicion-procesos-page.component';
import { DialogSubProcesosComponent } from './consulta-procesos-programados-page/DialogSubprocesos.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    ConsultaProcesosProgramadosPageComponent,
    DefinicionProcesosPageComponent,
    EjecucionProcesosPageComponent,
    ResultadoEjecucionProcesosPageComponent,
    DialogInformacionProcesos,
    DialogSubProcesosComponent
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

  exports:
    [
      EjecucionProcesosPageComponent,
      ResultadoEjecucionProcesosPageComponent,
      ConsultaProcesosProgramadosPageComponent,
      DefinicionProcesosPageComponent,

    ]

})
export class ProcesosModule {
}
