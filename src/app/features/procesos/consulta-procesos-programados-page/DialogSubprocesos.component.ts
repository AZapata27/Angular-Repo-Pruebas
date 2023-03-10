import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'creditos-epecificos',
  template: `
    <div class="tabulacion">
      <div class="card">
        <p-table [value]="subprocesos" sortMode="multiple"
                 [rows]="10"
                 responsiveLayout="scroll" [scrollable]="true"
                 scrollHeight="300px" styleClass="p-datatable-gridlines p-datatable-sm">

          <ng-template pTemplate="header">
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-subproceso>
            <tr>
              <!-- por corregir nombrePROCESO -->
              <td>{{subproceso.descripcion}}</td>
              <td>{{subproceso.descripcion}}</td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="2">No hay registros disponibles</td>
            </tr>
          </ng-template>


        </p-table>
      </div>
    </div>`
})
export class DialogSubProcesosComponent implements OnInit {

  subprocesos: any = [];


  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) {

    this.subprocesos = this.config.data.subprocesos;
  }

  ngOnInit(): void {

  }


}
