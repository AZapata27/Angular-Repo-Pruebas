import { Component, OnInit } from '@angular/core';
import { Informativa } from 'app/core/models/informativa.interface';
import { SubProceso } from 'app/core/models/subproceso.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProcesosEjecutadosServices } from '../../../core/services/procesosEjecutados.service';
import { map, tap } from 'rxjs/operators';

@Component({
  template: `
    <div class="tabulacion">
      <div class="card">
        <p-table [value]="procesos" sortMode="multiple" [paginator]="true" [rows]="10" [showCurrentPageReport]="true" selectionMode="single" responsiveLayout="scroll"
                 [scrollable]="true" scrollHeight="400px" styleClass="p-datatable-gridlines p-datatable-sm"
                 currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros">
          <ng-template pTemplate="header">
            <tr *ngIf="checkType === 'Informativa'">
              <th pSortableColumn="mensaje"> Mensaje
                <p-sortIcon field="mensaje"></p-sortIcon>
              </th>
              <th pSortableColumn="fecha-hora"> Fecha Hora
                <p-sortIcon field="fechahora"></p-sortIcon>
              </th>
            </tr>

            <tr *ngIf="checkType === 'Subprocesos'">
              <th pSortableColumn="nombre"> Nombre
                <p-sortIcon field="nombre"></p-sortIcon>
              </th>
              <th pSortableColumn="descripcion"> Descripcion
                <p-sortIcon field="descripcion"></p-sortIcon>
              </th>
            </tr>

          </ng-template>
          <ng-template pTemplate="body" let-proceso>

            <tr *ngIf="checkType === 'Informativa'">
              <td>{{  proceso.mensaje }}</td>
              <td> {{ proceso.fechaHora }} </td>
            </tr>

            <tr *ngIf="checkType === 'Subprocesos'">
              <td>{{  proceso.descripcion }}</td>
              <td> {{ proceso.descripcion }} </td>
            </tr>

          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="2">No hay registros disponibles</td>
            </tr>
          </ng-template>


        </p-table>
      </div>
    </div>
  `
})
export class DialogInformacionProcesos implements OnInit {


  procesos: Informativa[] | SubProceso[] = [];
  indice: string[] = [];
  checkType: string = "";


  constructor(public procesosEjecutadosServices: ProcesosEjecutadosServices,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) {


    switch (this.config.data.opcion) {
      case "subprocesos":

        this.procesosEjecutadosServices
          .getSubProcesos(this.config.data.consecutivo)
          .pipe(
            tap(),
            map(subs => {
              if (subs === null) {

                return this.procesos;
              }
              return subs.map<SubProceso>(subs => ({nombre: subs.nombre, descripcion: subs.descripcion}))
            }))
          .subscribe((subprocesos) => {
            this.procesos = subprocesos
          });

        this.checkType = 'Subprocesos';
        break;

      case "errores":
        this.procesosEjecutadosServices
          .getErrores(this.config.data.consecutivo)
          .subscribe((errores) => {
            this.procesos = errores;
          });

        this.checkType = 'Informativa';
        break;

      case "logs":
        this.procesosEjecutadosServices
          .getLogs(this.config.data.consecutivo)
          .subscribe((logs) => {
            this.procesos = logs;
          });

        this.checkType = 'Informativa';
        break;
    }


  }


  ngOnInit() {

  }


}
