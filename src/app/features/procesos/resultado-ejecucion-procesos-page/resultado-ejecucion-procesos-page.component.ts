import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcesosXEjecucion } from 'app/core/models/ProcesosXEjecucion.interface';
import { ProcesosEjecutadosServices } from 'app/core/services/procesosEjecutados.service';
import { MenuItem } from 'primeng/api/menuitem';
import { LazyLoadEvent, PrimeNGConfig, SelectItem, SortMeta } from 'primeng/api';
import { EstadoProcesosEjecucionEnum } from 'app/core/enums/estadoProcesosEjecucion.enum';
import { ProcesosXEjecucionResponse } from '../../../core/models/response/ProcesosXEjecucion.response';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogInformacionProcesos } from './DialogInformacionProcesos';
import { Informativa } from '../../../core/models/informativa.interface';
import { SubProceso } from '../../../core/models/subproceso.interface';
import { ProcesosXEjecucionRequest } from 'app/core/models/request/procesoXEjecucion.request';
import { TranslateService } from '@ngx-translate/core';
import { MensajeService } from 'app/core/services/mensaje.service';
import { Subscription } from 'rxjs';
import { DateUtilsService } from "../../../shared/services/date-utils.service";


@Component({
  selector: 'resultado-ejecucion-procesos-page',
  templateUrl: './resultado-ejecucion-procesos-page.component.html',
  providers: [DialogService]
})
export class ResultadoEjecucionProcesosPageComponent implements OnInit {

  busquedaSimple: boolean = true;
  opcionesBusqueda: SelectItem[] = [];
  estados: SelectItem[] = [];
  items: MenuItem[] = [];
  informacionProcesos: Informativa[] | SubProceso[] = [];
  indice: string[] = [];
  buscarComoOption: number = 1;
  subscription!: Subscription;
  @ViewChild('turboTable', {static: false}) turboTable: any;
  objetoABuscar!: ProcesosXEjecucionRequest;
  textBusquedaSimple: string = "";
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  procesosEjecutados!: ProcesosXEjecucionResponse;
  procesoSeleccionado!: ProcesosXEjecucion;
  dialogReferencia: DynamicDialogRef;


  ngOnInit(): void {
    this.llenarItems();

  }


  constructor(private procesosEjecutadosService: ProcesosEjecutadosServices,
              public dialogService: DialogService,
              private _formBuilder: FormBuilder,
              private translate: TranslateService,
              private config: PrimeNGConfig,
              private mensajeService: MensajeService,
              private dateUtilsService: DateUtilsService) {

    this.inicializarArraysYElementos();
    this.resetObjetoABuscar();
    this.cargarData(0, 10);

    this.translate.setDefaultLang('es');
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });

    this.dialogReferencia = new DynamicDialogRef();
    this.createForm();
  }


  // metodo para crear el formulario reactivo
  createForm() {
    if (this.busquedaSimple) {
      this.buscarComoOption = 1;
      this.formularioBusquedaSimple = this._formBuilder.group(
        {
          selectedIndice: [1],
          campoBuscar: [""]
        }
      )
    } else {
      this.formularioBusquedaAvanzada = this._formBuilder.group({
        numeroProcesoEjecutado: [""],
        nombreProceso: [""],
        nombreSubproceso: [""],
        fechaInicio: [""],
        estadoProceso: [""],
        fechaFinalizacion: [""]
      })
    }

    this.resetObjetoABuscar();
  }


  llenarItems(): void {

    const keysEstadoCredito = Object.keys(EstadoProcesosEjecucionEnum);


    this.estados.push({label: "-- SELECCIONE UN ESTADO --", value: ""});

    Object.values(EstadoProcesosEjecucionEnum).forEach((element, index) => {
      this.estados.push({
        label: element,
        value: `${keysEstadoCredito[index]}`
      })
    });

    this.opcionesBusqueda = [
      {label: "Numero de Proceso Ejecutado", value: 1},
      {label: "Nombre Proceso", value: 2},
      {label: "Nombre Sub-Proceso", value: 3},
      {label: "Fecha de inicio", value: 4},
      {label: "Estado", value: 5},
      {label: "Fecha de finalización", value: 6}
    ];

  }


  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
  }


  desplegarDialog(opcion: string) {
    if (this.verificarFilaSeleccionada()) {
      let tituloDialog = "";
      let consecutivo = 0;


      switch (opcion) {
        case "subprocesos":
          consecutivo = this.procesoSeleccionado.procesoConsecutivo;
          tituloDialog = "Sub-Procesos";
          break;

        case "errores":
          consecutivo = this.procesoSeleccionado.procesoXEjecucionConsecutivo;

          tituloDialog = "Errores del proceso";
          break;

        case "logs":
          consecutivo = this.procesoSeleccionado.procesoXEjecucionConsecutivo;
          tituloDialog = "Logs del proceso"
          break;
      }

      this.dialogReferencia = this.dialogService.open(DialogInformacionProcesos, {
        header: tituloDialog,
        width: '80%',
        autoZIndex: false,
        contentStyle: {'max-height': '80%', overflow: 'auto'},
        baseZIndex: 7000,
        data: {consecutivo: consecutivo, opcion: opcion}
      });
    }

  }


  verificarFilaSeleccionada(): boolean {
    if (this.procesoSeleccionado.procesoXEjecucionConsecutivo != 0) {
      return true;
    } else {
      return false;
    }
  }


  deSeleccionarFila() {
    this.procesoSeleccionado =
      {
        procesoXEjecucionConsecutivo: 0,
        numeroProcesoEjecutado: 0,
        procesoConsecutivo: 0,
        nombreProceso: "",
        nombreSubproceso: "",
        fechaInicio: new Date(),
        EstadoProcesosEjecucionEnum: EstadoProcesosEjecucionEnum['NO_EJECUTADO']
      }
  }


  cambiarCampoDeBusqueda() {

    this.buscarComoOption = Number.parseInt(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
    this.formularioBusquedaSimple.get("campoBuscar")?.setErrors(null);
  }


  buscarPorFiltroSimple() {

    let txtABuscar = this.formularioBusquedaSimple.get('campoBuscar')?.value;
    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.resetObjetoABuscar();
    switch (opcion) {
      case 1:
        this.objetoABuscar.numeroProcesoEjecutado = txtABuscar;
        break;
      case 2:
        this.objetoABuscar.nombreProceso = txtABuscar;
        break;
      case 3:
        this.objetoABuscar.nombreSubproceso = txtABuscar;
        break;
      case 4:
        this.objetoABuscar.fechaInicio = this.dateUtilsService.formatDateToDD_MM_YYYY(txtABuscar);
        break;
      case 5:
        this.objetoABuscar.estadoProceso = txtABuscar;
        break;
      case 6:
        this.objetoABuscar.fechaFinalizacion = this.dateUtilsService.formatDateToDD_MM_YYYY(txtABuscar);
        break;

    }

    this.turboTable._first = 0;
    this.objetoABuscar.size = 10;
    this.cargarData(0, 10);

  }


  buscarPorFiltroAvanzado() {

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.resetObjetoABuscar();
    this.objetoABuscar = {
      numeroProcesoEjecutado: this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.value,
      nombreProceso: this.formularioBusquedaAvanzada.get('nombreProceso')?.value,
      nombreSubproceso: this.formularioBusquedaAvanzada.get('nombreSubproceso')?.value,
      fechaInicio: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaInicio')?.value),
      fechaFinalizacion: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaFinalizacion')?.value),
      estadoProceso: this.formularioBusquedaAvanzada.get('estadoProceso')?.value,
      page: 0,
      size: 0,
      sort: ""
    }

    this.objetoABuscar.size = 10;
    this.turboTable._first = 0;
    this.cargarData(0, 10);

  }


  cambiarPage(event: LazyLoadEvent): void {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;
    this.cargarData(pageIndex, 10, event.multiSortMeta);
  }


  cargarData(page: number, size: number, sort?: SortMeta[]): void {

    /*
    if(sort != undefined){
      this.objetoABuscar.sort = sort[0].field + ',' +  ((sort[0].order === 1) ? "ASC" : "DESC");
   }*/

    this.procesosEjecutados.content = [];


    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.objetoABuscar.size = size;


      this.procesosEjecutadosService
        .busquedaPorFiltro(this.objetoABuscar)
        .subscribe(data => {
          if (data != null) {
            this.procesosEjecutados = data;
          } else {
            this, this.mostrarMensaje("La consulta no encontró registros");
            this.inicializarArraysYElementos();
          }

        })

    } else {

      this.procesosEjecutadosService
        .getProcesos(page, size, this.objetoABuscar.sort)
        .subscribe(data => {
          this.procesosEjecutados = data;
        });
    }

  }


  inicializarArraysYElementos() {

    this.procesosEjecutados = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    }

    this.procesoSeleccionado = {
      procesoXEjecucionConsecutivo: 0,
      numeroProcesoEjecutado: 0,
      procesoConsecutivo: 0,
      nombreProceso: "",
      nombreSubproceso: "",
      fechaInicio: new Date(),
      EstadoProcesosEjecucionEnum: EstadoProcesosEjecucionEnum['EE']
    };


  }

  resetObjetoABuscar() {
    this.objetoABuscar = {
      numeroProcesoEjecutado: "",
      nombreProceso: "",
      nombreSubproceso: "",
      fechaInicio: "",
      fechaFinalizacion: "",
      estadoProceso: "",
      page: 0,
      size: 0,
      sort: ""
    }
  }

  limpiarCamposFormularioBusquedaAvanzada() {
    // reseteamos el formulario
    this.formularioBusquedaAvanzada.reset();

    //Es necesario iniciar los campos, porque reset los establece
    //como nulos
    Object.keys(this.formularioBusquedaAvanzada.controls).forEach(key => {
      this.formularioBusquedaAvanzada.controls[key].setValue("");
    });
  }


  validarFechas(event: any, campo: string) {
    if (new RegExp(/^[0-9]|[-]$/).test(event.data) === false) {
      switch (campo) {
        case "campoBuscar":
          this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
          break;
        case "fechaInicio":
          this.formularioBusquedaAvanzada.get('fechaInicio')?.setValue("");
          break;
        case "fechaFinalizacion":
          this.formularioBusquedaAvanzada.get('fechaFinalizacion')?.setValue("");
          break;
      }
    }
  }


  validacionCamposFormularios(): boolean {
    if (this.busquedaSimple) {
      if ((this.buscarComoOption === 4 || this.buscarComoOption === 6)
        && this.formularioBusquedaSimple.get('campoBuscar')?.value === null) {
        this.mostrarMensaje('- El valor introducido no es una fecha válida. Ejemplo válido: "29-11-2005".');
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        return false;
      } else if (this.buscarComoOption === 1 && (isNaN(this.formularioBusquedaSimple.get('campoBuscar')?.value)
        || new RegExp(/^[0-9]*$/).test(this.formularioBusquedaSimple.get('campoBuscar')?.value) === false)) {
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");
        return false;
      }
    } else {

      if (this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.value === '') {
        this.mostrarMensaje("- Número de Proceso Ejecutado: Se debe introducir un valor.");
        this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.setValue("");
        return false;
      } else if (this.formularioBusquedaAvanzada.get('fechaInicio')?.value === null) {

        this.formularioBusquedaAvanzada.get('fechaInicio')?.setValue("");
        this.mostrarMensaje('Fecha Inicio - El valor introducido no es una fecha válida. Ejemplo válido: "29-11-2005".');
        return false;
      } else if (this.formularioBusquedaAvanzada.get('fechaFinalizacion')?.value === null) {
        this.formularioBusquedaAvanzada.get('fechaFinalizacion')?.setValue("");
        this.mostrarMensaje('Fecha Finalización - El valor introducido no es una fecha válida. Ejemplo válido: "29-11-2005".');
        return false;
      } else if (isNaN(this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.value) === false) {

        this.formularioBusquedaAvanzada.get('numeroProcesoEjecutado')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");

        return false;

      }

    }
    return true;
  }


  mostrarMensaje(mensaje: string) {
    this.mensajeService.mostrarMensajeError({
      showMessage: true,
      detalles: mensaje,
      icon: ''
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

