import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent, PrimeNGConfig, SelectItem } from 'primeng/api';
import { EjecucionProcesosService } from '../../../core/services/ejecucion-procesos.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  CreditosExcluir,
  CreditosExcluirContent,
  CreditosPorProceso
} from 'app/core/models/ProcesosEjecutados.interface';
import { ProcesosEjecutadosResponse } from '../../../core/models/response/ProcesosEjecutados.response';
import { delay, tap } from 'rxjs/operators';
import { ProcesosXEjecucion } from 'app/core/models/ProcesosXEjecucion.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreditosEpecificosComponent } from 'app/shared/components/creditos-epecificos/creditos-epecificos.component';
import { CreditosEspecificosService } from '../../../core/services/creditos-especificos.service';
import { ProcesoEjecutadoRequest } from '../../../core/models/request/procesoEjecutadoRequest';
import { MensajeService } from '../../../core/services/mensaje.service';
import { procesoEjecutadoGuardarRequest } from '../../../core/models/request/procesoEjecutadoGuardar.request';
import { Paginator } from 'primeng/paginator/paginator';
import { DateUtilsService } from "../../../shared/services/date-utils.service";


@Component({
  selector: 'ejecucion-procesos-page',
  templateUrl: './ejecucion-procesos-page.component.html',
  providers: [DialogService]
})

export class EjecucionProcesosPageComponent implements OnInit {


  procesosEjecucion: string[] = [];
  selectedValue: string = "Todo";
  selectedValueNuevaEjecucion: string = "Todo";
  opciones: SelectItem[] = [];
  estados: SelectItem[] = [];
  lineasCredito: SelectItem[] = [];
  tipoLiquidacion: SelectItem[] = [];
  tipoNomina: SelectItem[] = [];
  centroCosto: SelectItem[] = [];
  sucursales: SelectItem[] = [];

  busquedaSimple: boolean = true;
  campoBusqueda: number = 1;
  valorCriterioCoberturaACargar: string = "";
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  @ViewChild('paginador', {static: false}) paginador!: Paginator;
  subscription!: Subscription;

  procesosIncluidos: ProcesosXEjecucion[] = [];
  creditosPorProcesosArray: CreditosExcluirContent[] = [];
  creditosDeshacerProceso: CreditosExcluirContent[] = [];
  creditosDeshacerSeleccionTodo: boolean = false;
  deshacerCriterioCobertura: string = "";


  creditosSeleccionados: CreditosPorProceso = {} as CreditosPorProceso;
  creditosExcluidos: CreditosExcluir = {} as CreditosExcluir;

  totalElements: number = 0;
  currentPage: number = 0;
  nuevaEjecucionProcesos: boolean = false;
  busquedaConResultados: boolean = true;
  dialogReferencia: DynamicDialogRef;

  objetoABuscar!: ProcesoEjecutadoRequest;
  nuevaEjecucionProcesoAGuardar!: procesoEjecutadoGuardarRequest;


  procesoEjecutadoResponse: ProcesosEjecutadosResponse =
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    };


  constructor(
    private _formBuilder: FormBuilder,
    private ejecucionProcesosService: EjecucionProcesosService,
    private config: PrimeNGConfig,
    private translate: TranslateService,
    private creditosEspecificosService: CreditosEspecificosService,
    private mensajeService: MensajeService,
    public dialogService: DialogService,
    private dateUtilsServices: DateUtilsService) {

    this.inicializarArraysYElementos();
    this.resetObjetoABuscar();

    this.listenToCreditosSeleccionados();
    this.listenCreditoSeleccionadoAGuardar();
    this.dialogReferencia = new DynamicDialogRef();


  }

  ngOnInit(): void {
    this.createForm();
    this.translate.setDefaultLang('es');
    this.opciones = this.ejecucionProcesosService.getOpcionesBusqueda();
    this.estados = this.ejecucionProcesosService.getEstadoCredito();

    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });

    this.ejecucionProcesosService
      .getSucursales()
      .subscribe(sucursalesData => this.sucursales = sucursalesData);

    this.ejecucionProcesosService
      .getLineasCredito()
      .pipe()
      .subscribe(lineasData => this.lineasCredito = lineasData);

    this.ejecucionProcesosService
      .getTipoLiquidacion()
      .pipe()
      .subscribe(tipoLiquidacionData => this.tipoLiquidacion = tipoLiquidacionData);

    this.ejecucionProcesosService
      .getTipoNomina()
      .pipe()
      .subscribe(tipoNominaData => this.tipoNomina = tipoNominaData);

    this.ejecucionProcesosService
      .getCentroCosto()
      .pipe()
      .subscribe(centroCostoData => this.centroCosto = centroCostoData);

    this.cargarData(1, 0);
  }


  // metodo para crear el formulario reactivo form busqueda simple
  //y form busqueda avanzada.
  createForm() {
    if (this.busquedaSimple) {
      this.campoBusqueda = 1;
      this.formularioBusquedaSimple = this._formBuilder.group(
        {
          selectedIndice: [1],
          campoBuscar: [""]
        }
      );
    } else {
      this.formularioBusquedaAvanzada = this._formBuilder.group(
        {
          numeroProceso: [""],
          criterioCobertura: [""],
          fechaEjecucion: [""],
          estado: [""]
        });
    }
    this.resetObjetoABuscar();
  }


  // funcion que permite cambiar el formulario de busqueda
  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
  }


  cambiarCampoDeBusqueda(): void {
    this.campoBusqueda = Number.parseInt(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
    this.formularioBusquedaSimple.get("campoBuscar")?.setErrors(null);

  }

  validarFechas(event: any, campo: string) {
    if (new RegExp(/^[0-9]|[-]$/).test(event.data) === false) {
      switch (campo) {
        case "campoBuscar":
          this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
          break;
        case "fechaEjecucion":
          this.formularioBusquedaAvanzada.get('fechaEjecucion')?.setValue("");
          break;
      }
    }
  }


  buscarPorFiltroSimple() {

    this.nuevaEjecucionProcesos = false;

    if (!this.validacionCamposFormularios()) {
      return;
    }


    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    let txtABuscar = this.formularioBusquedaSimple.get('campoBuscar')?.value;


    this.resetObjetoABuscar();
    switch (opcion) {
      case 1:
        this.objetoABuscar.procesoEjecutadoConsecutivo = txtABuscar;
        break;
      case 2:
        this.objetoABuscar.criterioCobertura = txtABuscar;
        break;
      case 3:
        this.objetoABuscar.fechaInicio = this.dateUtilsServices.formatDateToDD_MM_YYYY(txtABuscar);
        break;
      case 4:
        this.objetoABuscar.estado = txtABuscar;
        break;
      case 5:
        this.objetoABuscar.lineasCreditoCodigo = txtABuscar;
        break;
      case 6:
        this.objetoABuscar.tipoLiquidacionCodigo = txtABuscar;
        break;
      case 7:
        this.objetoABuscar.tipoNominaConsecutivo = txtABuscar;
        break;
      case 8:
        this.objetoABuscar.centroCostoCodigo = txtABuscar;
        break;

    }


    if (this.paginador != undefined) {
      this.paginador.changePage(0);
    }

    this.objetoABuscar.size = 1;
    this.cargarData(1, 0);


  }


  buscarPorFiltroAvanzado() {

    this.nuevaEjecucionProcesos = false;

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.objetoABuscar = {

      procesoEjecutadoConsecutivo: this.formularioBusquedaAvanzada.get('numeroProceso')?.value,
      criterioCobertura: this.formularioBusquedaAvanzada.get('criterioCobertura')?.value,
      fechaInicio: this.dateUtilsServices.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaEjecucion')?.value),
      estado: this.formularioBusquedaAvanzada.get('estado')?.value,
      lineasCreditoCodigo: "",
      tipoLiquidacionCodigo: "",
      tipoNominaConsecutivo: "",
      centroCostoCodigo: "",
      page: 0,
      size: 0,
      sort: ""
    }


    if (this.paginador != undefined) {
      this.paginador.changePage(0);
    }

    this.objetoABuscar.size = 1;
    this.cargarData(1, 0);
  }


  cambiarProceso(event: any): void {
    let pagina = Number(event.page);
    if (this.currentPage - 1 != pagina) {
      this.cargarData(1, pagina);
    }

  }


  cargarData(size: number, page: number) {


    this.procesoEjecutadoResponse.content = [];
    this.creditosSeleccionados.content = [];
    this.creditosPorProcesosArray = [];


    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.objetoABuscar.size = size;


      this.ejecucionProcesosService
        .busquedaPorFiltro(this.objetoABuscar)
        .pipe(tap())
        .subscribe(data => {
          if (data != null) {
            this.busquedaConResultados = true;
            this.procesoEjecutadoResponse = data;
            this.procesosIncluidos = data.content[0].procesosIncluidos;
            this.currentPage = data.number + 1;
            this.totalElements = data.totalElements;
            this.selectedValue = data.content[0].criterioCobertura;
            this.deshacerCriterioCobertura = data.content[0].criterioCobertura;


            this.creditosSeleccionados = (data.content[0].creditos !== null) ? data.content[0].creditos : {} as CreditosPorProceso;
            this.creditosExcluidos = (data.content[0].creditosExcluir !== null) ? data.content[0].creditosExcluir : {} as CreditosExcluir;
            this.creditosPorProcesosArray = this.creditosExcluidos.content;

          } else {
            this.busquedaConResultados = false;
            this.creditosSeleccionados = {} as CreditosPorProceso;
            this.creditosExcluidos = {} as CreditosExcluir;
            this.creditosPorProcesosArray = [];

            this.mostrarMensaje("La consulta no encontró registros", 'ERROR');
            this.currentPage = 0;
            this.totalElements = 0;
            this.inicializarArraysYElementos();

          }

        })
    } else {

      this.busquedaConResultados = true;
      this.ejecucionProcesosService
        .getProcesosEjecutados(size, page)
        .pipe(tap())
        .subscribe(data => {
          this.procesoEjecutadoResponse = data;
          this.procesosIncluidos = data.content[0].procesosIncluidos;
          this.currentPage = data.number + 1;
          this.totalElements = data.totalElements;
          this.selectedValue = data.content[0].criterioCobertura;
          this.deshacerCriterioCobertura = data.content[0].criterioCobertura;

          this.creditosSeleccionados = (data.content[0].creditos !== null) ? data.content[0].creditos : {} as CreditosPorProceso;
          this.creditosExcluidos = (data.content[0].creditosExcluir !== null) ? data.content[0].creditosExcluir : {} as CreditosExcluir;
          this.creditosPorProcesosArray = this.creditosExcluidos.content;


        });

    }

  }


  deshabilitarRadios(): boolean {
    const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
    return (estado === 'CANCELADO' || estado === 'TERMINADO'
      || estado === 'PAUSADO' || estado === 'ELIMINADO');
  }

  crearNuevaEjecucionProceso() {

    this.ejecucionProcesosService.getEstadoUltimoProcesoEjecutado().subscribe(estado => {

      if (!(estado === 'EJECUTANDOSE-EJE' || estado === 'PAUSADO-PAP' || estado === 'PAUSADO-PAU')) {
        this.nuevaEjecucionProcesos = true;
        this.busquedaConResultados = true;
        this.valorCriterioCoberturaACargar = "";
        this.creditosSeleccionados = {} as CreditosPorProceso;
        this.creditosExcluidos = {} as CreditosExcluir;
        this.creditosSeleccionados.content = [];
        this.procesosIncluidos = [];
        this.creditosPorProcesosArray = [];
        this.procesoEjecutadoResponse.content[0].estado = '';
        this.procesoEjecutadoResponse.content[0].criterioCobertura = '';


        this.ejecucionProcesosService.obtenerFechaEjecucion()
          .subscribe(fecha => {
            this.nuevaEjecucionProcesoAGuardar.fechaInicio = fecha.toString().slice(1, -1);
            this.nuevaEjecucionProcesoAGuardar.fechaFinalizacion = fecha.toString().slice(1, -1);
          });

        this.creditosSeleccionados.content = [];
        this.nuevaEjecucionProcesoAGuardar.criterioCobertura = "TO";

      } else {

        this.mostrarMensaje("Error: [KEP21323 Error al crear la ejecución del proceso."
          + "<br> Causa: Todos los procesos anteriores deben  <br> estar en estado Definido, "
          + "Eliminado o Terminado.  <br> Solución: Cambie los estados  <br> de los procesos anteriores. ]", "ERROR")

      }
    })

  }


  showDialogCreditosEspecificos() {
    this.dialogReferencia = this.dialogService.open(CreditosEpecificosComponent, {
      header: 'Seleccionar Credito(s)',
      width: '90%',
      autoZIndex: false,
      contentStyle: {'max-height': '100rem', overflow: 'auto'},
      baseZIndex: 7000,
      data: {consecutivo: 1, opcion: ""}
    });
  }

  cargarCamposCriteriosCobertura(valor: string): void {
    this.valorCriterioCoberturaACargar = "";
    this.valorCriterioCoberturaACargar = valor;


    this.nuevaEjecucionProcesoAGuardar.sucursalInicioCodigoLocalidad = "";
    this.nuevaEjecucionProcesoAGuardar.sucursalFinCodigoLocalidad = "";
    this.nuevaEjecucionProcesoAGuardar.creditosEspecificosConsecutivos = [];
    this.nuevaEjecucionProcesoAGuardar.lineaCredito = "";
    this.nuevaEjecucionProcesoAGuardar.tipoNominaConsecutivo = "";
    this.nuevaEjecucionProcesoAGuardar.tipoLiquidacionTipoCodigo = "";
    this.nuevaEjecucionProcesoAGuardar.centroCostoCodigo = "";

    switch (this.nuevaEjecucionProcesoAGuardar.criterioCobertura) {
      case 'PS':
        this.nuevaEjecucionProcesoAGuardar.sucursalInicioCodigoLocalidad = "0";
        this.nuevaEjecucionProcesoAGuardar.sucursalFinCodigoLocalidad = "0";
        break;
      case 'LC':
        this.nuevaEjecucionProcesoAGuardar.lineaCredito = "0";
        break;
      case 'TN':
        this.nuevaEjecucionProcesoAGuardar.tipoNominaConsecutivo = "0";
        break;
      case 'TL':
        this.nuevaEjecucionProcesoAGuardar.tipoLiquidacionTipoCodigo = "0";
        break;
      case 'CC':
        this.nuevaEjecucionProcesoAGuardar.centroCostoCodigo = "0";
        break;
    }

    this.creditosSeleccionados.content = [];
    this.creditosEspecificosService.borrarTodo();


  }

  listenToCreditosSeleccionados() {

    this.creditosEspecificosService.creditosListSubject
      .pipe(delay(0)) // Este delay previene una ExpressionChangedAfterItHasBeenCheckedError
      .subscribe((emicion) => {

        /* if(this.nuevaEjecucionProcesos === true){
           this.creditosSeleccionados.content =  ;
         }*/

        emicion.forEach((value) => {
          if (this.creditosSeleccionados.content.filter(cre => cre.consecutivo === value.consecutivo.toString()).length === 0) {
            this.creditosSeleccionados.content.push({
              consecutivo: value.consecutivo.toString(),
              numeroCredito: value.numeroCredito,
              creditosConsecutivo: value.consecutivo.toString()
            })
          }
        })

        if (this.nuevaEjecucionProcesos === true) {
          this.creditosSeleccionados.totalElements = this.creditosSeleccionados.content.length;
        }

      });
  };


  listenCreditoSeleccionadoAGuardar() {

    this.creditosEspecificosService
      .nuevoCreditoSeleccionado
      .pipe(delay(0))
      .subscribe((consecutivoEmitido) => {
        if (this.nuevaEjecucionProcesos !== true && consecutivoEmitido !== 0) {
          this.ejecucionProcesosService
            .AgregarCreditoSeleccionado(this.procesoEjecutadoResponse.content[0].consecutivo, [consecutivoEmitido])
            .subscribe(res => {
              this.creditosSeleccionados.totalElements = this.creditosSeleccionados.content.length;
            })
        }
      })
  }


  eliminarCredito(creditosConsecutivo: number) {

    if (this.nuevaEjecucionProcesos) {

      this.creditosSeleccionados.content = this.creditosSeleccionados.content
        .filter(p => p.creditosConsecutivo != String(creditosConsecutivo));
      this.creditosSeleccionados.totalElements = this.creditosSeleccionados.content.length;

    } else {

      this.ejecucionProcesosService
        .eliminarCreditoPorProceso(this.procesoEjecutadoResponse.content[0].consecutivo, creditosConsecutivo)
        .subscribe(data => {
          if (data !== null && data !== undefined) {

            this.creditosSeleccionados.content = this.creditosSeleccionados.content
              .filter(p => p.creditosConsecutivo != String(creditosConsecutivo));
          }

          this.creditosSeleccionados.totalElements = this.creditosSeleccionados.content.length;

        });

      /*
      this.creditosSeleccionados = this.creditosSeleccionados
      .filter( p => p.numeroCredito != numeroCredito);*/
    }

  }

  mostrarMensaje(mensaje: string, flagMessage: string) {

    if (flagMessage === 'ERROR') {
      this.mensajeService.mostrarMensajeError({
        showMessage: true,
        detalles: mensaje,
        icon: ''
      });
    } else if (flagMessage === 'SUCCESS') {
      this.mensajeService.mostrarMensajeExitoso({
        showMessage: true,
        detalles: mensaje,
        icon: ''
      });
    }

  }


  inicializarArraysYElementos() {

    this.objetoABuscar = {
      procesoEjecutadoConsecutivo: "",
      criterioCobertura: "",
      fechaInicio: "",
      estado: "",
      lineasCreditoCodigo: "",
      tipoLiquidacionCodigo: "",
      tipoNominaConsecutivo: "",
      centroCostoCodigo: "",
      page: 0,
      size: 0,
      sort: ""
    }

    this.nuevaEjecucionProcesoAGuardar = {
      fechaInicio: "",
      fechaFinalizacion: "",
      sucursalInicioCodigoLocalidad: "",
      sucursalFinCodigoLocalidad: "",
      criterioCobertura: "",
      lineaCredito: "",
      tipoLiquidacionTipoCodigo: "",
      centroCostoCodigo: "",
      tipoNominaConsecutivo: "",
      creditosEspecificosConsecutivos: []
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


  resetObjetoABuscar() {
    this.objetoABuscar = {
      procesoEjecutadoConsecutivo: "",
      criterioCobertura: "",
      fechaInicio: "",
      estado: "",
      lineasCreditoCodigo: "",
      tipoLiquidacionCodigo: "",
      tipoNominaConsecutivo: "",
      centroCostoCodigo: "",
      page: 0,
      size: 0,
      sort: ""
    }
  }


  validacionCamposFormularios(): boolean {
    if (this.busquedaSimple) {

      // Valida el formulario busqueda simple.
      if ((this.campoBusqueda === 3)
        && this.formularioBusquedaSimple.get('campoBuscar')?.value === null) {
        this.mostrarMensaje('- El valor introducido no es una fecha válida. Ejemplo válido: "29-11-2005".', 'ERROR');
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        return false;
      } else if (this.campoBusqueda === 1 && (isNaN(this.formularioBusquedaSimple.get('campoBuscar')?.value)
        || new RegExp(/^[0-9]*$/).test(this.formularioBusquedaSimple.get('campoBuscar')?.value) === false)) {
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico", 'ERROR');
        return false;
      }

    } else {

      // Valida el formulario busqueda avanzada.

      if (this.formularioBusquedaAvanzada.get('fechaEjecucion')?.value === null) {

        this.formularioBusquedaAvanzada.get('fechaEjecucion')?.setValue("");
        this.mostrarMensaje('Fecha Ejecucion  - El valor introducido no es una fecha válida. Ejemplo válido: "29-11-2005".', 'ERROR');
        return false;
      } else if (isNaN(this.formularioBusquedaAvanzada.get('numeroProceso')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('numeroProceso')?.value) === false) {

        this.formularioBusquedaAvanzada.get('numeroProceso')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico", 'ERROR');

        return false;
      }

    }
    return true;
  }

  validarNuevaEjecucionProcesoAGuardar(): boolean {
    const criterio = this.nuevaEjecucionProcesoAGuardar.criterioCobertura;
    let resultadoValidacion = true;

    // se omiten todo y criterios cobertura, puesto que no tienen ninguna validación al moemento de guardar.
    switch (criterio) {
      case 'PS':
        if (this.nuevaEjecucionProcesoAGuardar.sucursalInicioCodigoLocalidad === String(0) &&
          this.nuevaEjecucionProcesoAGuardar.sucursalFinCodigoLocalidad === String(0)) {
          this.mostrarMensaje("1. Sucursal Inicial - Selección necesaria.<br>2. Sucursal Final - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        } else if (this.nuevaEjecucionProcesoAGuardar.sucursalInicioCodigoLocalidad === String(0)) {
          this.mostrarMensaje("1. Sucursal Inicial - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        } else if (this.nuevaEjecucionProcesoAGuardar.sucursalFinCodigoLocalidad === String(0)) {
          this.mostrarMensaje("2. Sucursal Final - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        }
        break;
      case 'LC':
        if (this.nuevaEjecucionProcesoAGuardar.lineaCredito === String(0)) {
          this.mostrarMensaje("Líneas Crédito - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        }
        break;
      case 'TN':
        if (this.nuevaEjecucionProcesoAGuardar.tipoNominaConsecutivo === String(0)) {
          this.mostrarMensaje("Tipo Nómina - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        }
        break;
      case 'TL':
        if (this.nuevaEjecucionProcesoAGuardar.tipoLiquidacionTipoCodigo === String(0)) {
          this.mostrarMensaje("Tipo Liquidación - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        }
        break;
      case 'CC':
        if (this.nuevaEjecucionProcesoAGuardar.centroCostoCodigo === String(0)) {
          this.mostrarMensaje("Centro de Costo - Selección necesaria.", 'ERROR');
          resultadoValidacion = false;
        }
        break;

    }
    return resultadoValidacion;
  }

  guardarNuevaEjecucionProceso() {

    if (this.validarNuevaEjecucionProcesoAGuardar() && this.nuevaEjecucionProcesos === true) {

      this.creditosSeleccionados.content.forEach((valor) => {
        this.nuevaEjecucionProcesoAGuardar.creditosEspecificosConsecutivos.push(valor.consecutivo);
      });


      this.ejecucionProcesosService
        .guardarNuevaEjecucionProceso(this.nuevaEjecucionProcesoAGuardar)
        .subscribe(res => {

          if (res.consecutivo != null && res.consecutivo !== undefined) {
            this.mostrarMensaje('Transacción exitosa', 'SUCCESS');
            this.resetObjetoABuscar();
            this.cargarData(1, 0);
            this.nuevaEjecucionProcesos = false;
          }
        });

    }
  }

  eliminarEjecucionProceso(consecutivo: number) {
    this.ejecucionProcesosService
      .eliminarEjecucionProceso(consecutivo).subscribe(res => {
      if (res === null) {
        this.mostrarMensaje("Transacción Exitosa", "SUCCESS");
        this.cargarData(1, this.paginador.paginatorState.page);
      }
    });
  }

  ejecutarEjecucionProceso(consecutivo: number) {
    this.ejecucionProcesosService
      .ejecutarEjecucionProceso(consecutivo).subscribe(res => {
      if (res !== null) {
        this.mostrarMensaje("Transacción Exitosa  <BR> <BR> " + res, "SUCCESS");
        this.cargarData(1, this.paginador.paginatorState.page);
      }
    });
  }


  mostrarCreditosSeleccionados(): boolean {

    if (this.nuevaEjecucionProcesos === true && this.nuevaEjecucionProcesoAGuardar.criterioCobertura === 'CE') {
      return true;
    }
//&& this.creditosSeleccionados.length > 0
    if (this.procesoEjecutadoResponse.content.length > 0) {
      if ((this.procesoEjecutadoResponse.content[0].criterioCobertura === 'Créditos Específicos') || this.nuevaEjecucionProcesoAGuardar.criterioCobertura === 'CE') {
        return true;
      }
    }
    return false;
  }


  activarBotonEliminarCredito() {
    if (this.nuevaEjecucionProcesos === true) {
      return false;
    }

    if (this.procesoEjecutadoResponse.content.length > 0) {
      if (this.procesoEjecutadoResponse.content[0].estado.toUpperCase() === 'DEFINIDO'
        || this.procesoEjecutadoResponse.content[0].estado.toUpperCase() === 'DESPUES DESHACER'
        || ((this.procesoEjecutadoResponse.content[0].estado.toUpperCase() === 'PAUSADO-PAP' ||
            this.procesoEjecutadoResponse.content[0].estado.toUpperCase() === 'PAUSADO-PAU')
          && this.procesoEjecutadoResponse.content[0].criterioCobertura === 'Créditos Específicos')) {
        return false;
      }
    }
    return true;
  }


  activarBotonEliminar() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if (estado !== 'DEFINIDO' || this.nuevaEjecucionProcesos === true) {
        return false;
      }
    }
    return true;
  }


  activarBotonGrabar() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'DEFINIDO' || estado === 'DESPUES DESHACER' || this.nuevaEjecucionProcesos === true)) {
        return true;
      }
    }
    return false;
  }


  activarBotonEjecutar() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'DEFINIDO' || estado === 'DESPUES DESHACER' || this.nuevaEjecucionProcesos === true)) {
        return true;
      }
    }
    return false;
  }

  activarBotonContinuar() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'PAUSADO-PAP' || estado === 'PAUSADO-PAU')) {
        return true;
      }
    }
    return false;
  }


  activarBotonEjecucionAutomatica() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'DEFINIDO' || estado === 'TERMINADO-TER' || estado === 'TERMINADO-TEP'
        || estado === 'DESPUES DESHACER')) {
        return true;
      }
    }
    return false;
  }

  activarBotonCerrarDia() {
    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'TERMINADO-TER' || estado === 'TERMINADO-TEP')) {
        return true;
      }
    }
    return false;
  }


  validarBotonAgregarNuevoRegistro() {
    if (this.procesoEjecutadoResponse.content.length > 0) {

      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if ((estado === 'DEFINIDO' && this.nuevaEjecucionProcesos === false)) {
        return true;
      }
    }
    return false;
  }


  mostrarCreditosAExcluir() {
    // Validar TODO

    /*
     && (  this.procesoEjecutadoResponse.content[0].criterioCobertura === 'Créditos Específicos')
           || this.procesoEjecutadoResponse.content[0].criterioCobertura === 'Todo'
    */

    if (this.procesoEjecutadoResponse.content.length > 0) {
      const estado = this.procesoEjecutadoResponse.content[0].estado.toUpperCase();
      if (((estado === 'DESPUES DESHACER' || estado === 'EJECUTANDOSE-EJP' || (estado === 'PAUSADO-PAP'
        && this.procesoEjecutadoResponse.content[0].criterioCobertura === 'Créditos Específicos')) && this.nuevaEjecucionProcesos === false)) {
        return true;
      }
    }
    return false;
  }


  cambiarPageCreditos(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    this.ejecucionProcesosService.getCreditosSeleccionadosDelProceso(this.procesoEjecutadoResponse.content[0].consecutivo, pageIndex)
      .subscribe(data => {
        this.creditosSeleccionados = data;
      })

  }


  cambiarPageCreditosExcluir(event: LazyLoadEvent) {

    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    this.ejecucionProcesosService
      .getCreditosExcluidosXProcesoEjecutado(this.procesoEjecutadoResponse.content[0].consecutivo, pageIndex)
      .subscribe(data => {
        this.creditosExcluidos = data;
      });

  }

  cambiarPageCreditosPorProceso(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    this.ejecucionProcesosService
      .getCreditosExcluidosXProcesoEjecutado(this.procesoEjecutadoResponse.content[0].consecutivo, pageIndex)
      .subscribe(data => {
        this.creditosPorProcesosArray = data.content;

      });
  }


  seleccionarTodoCreditosPorProceso() {
    this.creditosDeshacerSeleccionTodo = true;
    this.creditosDeshacerProceso = this.creditosPorProcesosArray;
  }


  noSeleccionarCreditosPorProceso() {
    this.creditosDeshacerSeleccionTodo = false;
    this.creditosDeshacerProceso = [];
  }


  excluirCreditoCheck(seleccionado: string, consecutivoCredito: number) {

    const excluir = (seleccionado === 'N') ? true : false;

    this.ejecucionProcesosService
      .excluirCredito(this.procesoEjecutadoResponse.content[0].consecutivo, consecutivoCredito, excluir)
      .subscribe(data => {
        this.procesoEjecutadoResponse.content[0].creditosExcluir = data.content[0].creditosExcluir;
      });

  }


}

