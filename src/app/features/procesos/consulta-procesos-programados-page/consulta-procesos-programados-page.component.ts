import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent, PrimeNGConfig, SelectItem, SortMeta } from 'primeng/api';
import { ConsultaProcesosProgramadosService } from '../../../core/services/consulta-procesos-programados.service';
import { ProcesosProgramados } from '../../../core/models/response/ProcesosProgramados.response';
import { ProcesosProgramadosResponse } from 'app/core/models/response/ProcesosProgramados.response';
import { ProcesosEjecutadosServices } from '../../../core/services/procesosEjecutados.service';
import { SubProceso } from '../../../core/models/subproceso.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogSubProcesosComponent } from './DialogSubprocesos.component';
import { ProcesoProgramadoRequest } from '../../../core/models/request/procesoProgramado.request';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MensajeService } from 'app/core/services/mensaje.service';
import { DateUtilsService } from "../../../shared/services/date-utils.service";


@Component({
  selector: 'app-consulta-procesos-programados-page',
  templateUrl: './consulta-procesos-programados-page.component.html',
  providers: [DialogService]
})
export class ConsultaProcesosProgramadosPageComponent implements OnInit {

  busquedaSimple: boolean = true;
  buscarComoOption: number = 1;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  subscription!: Subscription;
  opciones: SelectItem[] = [];
  periodicidad: SelectItem[] = [];
  siYNoOpciones: SelectItem[] = [];
  dialogReferencia!: DynamicDialogRef;
  procesosProgramadosResponse: ProcesosProgramadosResponse = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0
  };


  procesoProgramadoSeleccionado: ProcesosProgramados = {
    consecutivo: 0,
    procesosConsecutivo: 0,
    procesosNombre: "",
    tipo: "",
    fechaInicio: "",
    ultimaFechaEjecucion: "",
    soloDiaHabil: "",
    domingo: "",
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    diaSemana: "",
    diaMes: 0,
    fechaEspecifica: "",
    alternada: "",
    procesosProcesoPadreConsecutivo: ""
  };

  objetoABuscar!: ProcesoProgramadoRequest;


  constructor(
    private _formBuilder: FormBuilder,
    private consultaprocesosProgramadosService: ConsultaProcesosProgramadosService,
    private procesosEjecutadosService: ProcesosEjecutadosServices,
    public dialogService: DialogService,
    private mensajeService: MensajeService,
    private translate: TranslateService,
    private config: PrimeNGConfig,
    private dateUtilsService: DateUtilsService) {


  }

  ngOnInit(): void {
    this.opciones = this.consultaprocesosProgramadosService.getItemsBusqueda();
    this.periodicidad = this.consultaprocesosProgramadosService.getPeriodicidad();
    this.siYNoOpciones = this.consultaprocesosProgramadosService.getSiNo();
    this.inicializarArraysYElementos();
    this.resetObjetoABuscar();
    this.createForm();
    this.cargarData(0, 15);
    this.translate.setDefaultLang('es');
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
  }

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

      this.formularioBusquedaAvanzada = this._formBuilder.group(
        {
          proceso: [""],
          periodicidad: [""],
          fechaInicio: [""],
          fechaEspecifica: [""],
          diasHabiles: [""],
          domingo: [""],
          lunes: [""],
          martes: [""],
          miercoles: [""],
          jueves: [""],
          viernes: [""],
          sabado: [""],
          diaDelMes: [""]
        }
      )

    }
    this.resetObjetoABuscar();

  }

  cambiarCampoDeBusqueda() {
    const opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.buscarComoOption = opcion;
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
  }

  buscarPorFiltroSimple() {

    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);

    if (!this.validacionCamposFormularios()) {
      return;
    }

    // continua la busqueda por filtro simple.
    this.resetObjetoABuscar();
    let txtABuscar = this.formularioBusquedaSimple.get('campoBuscar')?.value;


    switch (opcion) {
      case 1:
        this.objetoABuscar.nombreProceso = txtABuscar;
        break;
      case 2:
        this.objetoABuscar.tipo = txtABuscar;
        break;
      case 3:
        this.objetoABuscar.fechaInicio = this.dateUtilsService.formatDateToDD_MM_YYYY(txtABuscar);
        break;
      case 4:
        this.objetoABuscar.fechaEspecifica = this.dateUtilsService.formatDateToDD_MM_YYYY(txtABuscar);
        break;
      case 5:
        this.objetoABuscar.soloDiaHabil = txtABuscar;
        break;
      case 6:
        this.objetoABuscar.domingo = txtABuscar;
        break;
      case 7:
        this.objetoABuscar.lunes = txtABuscar;
        break;
      case 8:
        this.objetoABuscar.martes = txtABuscar;
        break;
      case 9:
        this.objetoABuscar.miercoles = txtABuscar;
        break;
      case 10:
        this.objetoABuscar.jueves = txtABuscar;
        break;
      case 11:
        this.objetoABuscar.viernes = txtABuscar;
        break;
      case 12:
        this.objetoABuscar.sabado = txtABuscar;
        break;
      case 13:
        this.objetoABuscar.diaMes = txtABuscar;
        break;

    }

    this.objetoABuscar.size = 15;
    this.cargarData(0, 15);


  }


  cambiarPage(event: LazyLoadEvent) {

    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    // @ts-ignore
    this.cargarData(pageIndex, 15, event.multiSortMeta);

  }

  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
  }

  buscarPorFiltroAvanzado() {

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.objetoABuscar = {
      nombreProceso: this.formularioBusquedaAvanzada.get('proceso')?.value,
      tipo: this.formularioBusquedaAvanzada.get('periodicidad')?.value,
      fechaInicio: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaInicio')?.value),
      fechaEspecifica: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaEspecifica')?.value),
      soloDiaHabil: this.formularioBusquedaAvanzada.get('diasHabiles')?.value,
      domingo: this.formularioBusquedaAvanzada.get('domingo')?.value,
      lunes: this.formularioBusquedaAvanzada.get('lunes')?.value,
      martes: this.formularioBusquedaAvanzada.get('martes')?.value,
      miercoles: this.formularioBusquedaAvanzada.get('miercoles')?.value,
      jueves: this.formularioBusquedaAvanzada.get('jueves')?.value,
      viernes: this.formularioBusquedaAvanzada.get('viernes')?.value,
      sabado: this.formularioBusquedaAvanzada.get('sabado')?.value,
      diaMes: this.formularioBusquedaAvanzada.get('diaDelMes')?.value,
      page: 0,
      size: 0,
      sort: ""
    }


    this.objetoABuscar.size = 15;
    this.cargarData(0, 15);

  }


  cargarData(page: number, size: number, sort?: SortMeta[]): void {

    if (sort != undefined) {
      this.objetoABuscar.sort = sort[0].field + ',' + ((sort[0].order === 1) ? "ASC" : "DESC");
    }


    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.objetoABuscar.size = size;

      this.procesosProgramadosResponse.content = [];

      this.consultaprocesosProgramadosService
        .busquedaPorFiltro(this.objetoABuscar)
        .subscribe(data => {
          if (data != null) {
            this.procesosProgramadosResponse = data;
          } else {
            this.mostrarMensaje("La busqueda no arrojó ningun resultado")
            this.inicializarArraysYElementos();
          }
        });
    } else {

      this.procesosProgramadosResponse.content = [];
      this.consultaprocesosProgramadosService
        .getProcesosProgramados(page, size, this.objetoABuscar.sort)
        .subscribe(data => {
          this.procesosProgramadosResponse = data;
        });
    }


  }

  deSeleccionarFila() {
    this.procesoProgramadoSeleccionado = {
      consecutivo: 0,
      procesosConsecutivo: 0,
      procesosNombre: "",
      tipo: "",
      fechaInicio: "",
      ultimaFechaEjecucion: "",
      soloDiaHabil: "",
      domingo: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      diaSemana: "",
      diaMes: 0,
      fechaEspecifica: "",
      alternada: "",
      procesosProcesoPadreConsecutivo: ""
    };
  }

  buscarSubprocesos() {
    if (this.procesoProgramadoSeleccionado.consecutivo != 0) {

      const consecutivo = this.procesoProgramadoSeleccionado.procesosConsecutivo;
      let subprocesosArray: SubProceso[] = [];

      this.procesosEjecutadosService
        //@ts-ignore
        .getSubProcesos(consecutivo)
        .subscribe(
          {
            next: val => {
              if (val != null) {
                subprocesosArray = val;
              }
            },
            complete: () => {
              this.dialogReferencia = this.dialogService.open(DialogSubProcesosComponent, {
                header: 'Subprocesos',
                width: '40%',
                autoZIndex: false,
                contentStyle: {'max-height': '300px', overflow: 'auto'},
                baseZIndex: 7000,
                data: {subprocesos: subprocesosArray}
              });
            }
          }
        );


    }
  }

  inicializarArraysYElementos() {
    this.procesosProgramadosResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    };

    this.procesoProgramadoSeleccionado = {
      consecutivo: 0,
      procesosConsecutivo: 0,
      procesosNombre: "",
      tipo: "",
      fechaInicio: "",
      ultimaFechaEjecucion: "",
      soloDiaHabil: "",
      domingo: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      diaSemana: "",
      diaMes: 0,
      fechaEspecifica: "",
      alternada: "",
      procesosProcesoPadreConsecutivo: ""
    }

    this.resetObjetoABuscar();

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
      nombreProceso: "",
      tipo: "",
      fechaInicio: "",
      fechaEspecifica: "",
      soloDiaHabil: "",
      domingo: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      diaMes: "",
      page: 0,
      size: 0,
      sort: ""
    }
  }

  mostrarMensaje(mensaje: string) {
    this.mensajeService.mostrarMensajeError({
      showMessage: true,
      detalles: mensaje,
      icon: ''
    });
  }

  validacionCamposFormularios(): boolean {

    if (this.busquedaSimple) {
      if ((this.buscarComoOption === 3 || this.buscarComoOption === 4)
        && this.formularioBusquedaSimple.get('campoBuscar')?.value === null) {
        this.mostrarMensaje("Dato ingresado no es una fecha.");
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        return false;
      } else if (this.buscarComoOption === 13 && (isNaN(this.formularioBusquedaSimple.get('campoBuscar')?.value)
        || new RegExp(/^[0-9]*$/).test(this.formularioBusquedaSimple.get('campoBuscar')?.value) === false)) {
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        this.mostrarMensaje("Dato ingresado no es un número.");
        return false;
      }
    } else {

      if (this.formularioBusquedaAvanzada.get('fechaInicio')?.value === null) {

        this.formularioBusquedaAvanzada.get('fechaInicio')?.setValue("");
        this.mostrarMensaje("Dato ingresado no es una fecha.");
        return false;
      } else if (this.formularioBusquedaAvanzada.get('fechaEspecifica')?.value === null) {
        this.formularioBusquedaAvanzada.get('fechaEspecifica')?.setValue("");
        this.mostrarMensaje("Dato ingresado no es una fecha.");
        return false;
      } else if (isNaN(this.formularioBusquedaAvanzada.get('diaDelMes')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('diaDelMes')?.value) === false) {

        this.formularioBusquedaAvanzada.get('diaDelMes')?.setValue("");
        this.mostrarMensaje("Dato ingresado no es un número.");

        return false;

      }


    }
    return true;
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
        case "fechaEspecifica":
          this.formularioBusquedaAvanzada.get('fechaEspecifica')?.setValue("");
          break;
      }
    }
  }

}
