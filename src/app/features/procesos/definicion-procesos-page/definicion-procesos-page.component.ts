import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MensajeService } from 'app/core/services/mensaje.service';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs/internal/Subscription';
import { DefinicionProcesosService } from '../../../core/services/definicion-procesos.service';
import { ProcesosDefinidos } from '../../../core/models/response/ProcesosDefinicion.response';
import { ProcesosProgramados } from '../../../core/models/response/ProcesosProgramados.response';
import { ProcesoPadreRequest } from '../../../core/models/request/ProcesoPadre.request';
import { Procesos } from '../../../core/models/Procesos.interface';
import { Paginator } from 'primeng/paginator';
import { procesoProgramadoRequestGuardar } from 'app/core/models/request/procesoProgramado.request';
import { DateUtilsService } from "../../../shared/services/date-utils.service";

@Component({
  selector: 'app-definicion-procesos-page',
  templateUrl: './definicion-procesos-page.component.html'
})
export class DefinicionProcesosPageComponent implements OnInit {

  busquedaSimple: boolean = true;
  buscarComoOption: number = 1;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  subscription!: Subscription;
  procesosDefinidosObservable!: Subscription;
  opciones: SelectItem[] = [];
  siYNoOpciones: SelectItem[] = [];
  ejecucionXPeridicidadList: SelectItem[] = [];
  procesosProgramacion: ProcesosProgramados[] = [];
  //programacionProcesoSeleccionado! : ProcesosProgramados;
  nuevaProgramacionProcesos!: procesoProgramadoRequestGuardar;
  objetoABuscar!: Procesos;
  cargarDataPorBusqueda: boolean = false;
  @ViewChild('paginador', {static: false}) paginador!: Paginator;

  procesosDefinidos!: ProcesosDefinidos;
  procesoDefinidoAComparar!: ProcesosDefinidos;
  totalElements: number = 0;
  currentPage: number = 0;
  tipoProgramacion: string = "";
  mostrarModalNuevaProgramacion: boolean = false;
  busquedaConResultados: boolean = true;


  constructor(private _formBuilder: FormBuilder,
              private mensajeService: MensajeService,
              private translate: TranslateService,
              private config: PrimeNGConfig,
              private definicionProcesosService: DefinicionProcesosService,
              private dateUtilsService: DateUtilsService) {


    this.inicializarArraysYElementos();
    this.opciones = this.definicionProcesosService.getOpcionesBusqueda();
    this.ejecucionXPeridicidadList = this.definicionProcesosService.getPeriodicidad();
    this.siYNoOpciones = this.definicionProcesosService.getSiNo();
    this.createForm();
    this.cargarData(0);

  }


  ngOnInit(): void {
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
          nombreProceso: [""],
          descripcion: [""],
          ejecucionXPeriodicidad: [""],
          fechaInicio: [""],
          ejecucionXFechaEspecifica: [""],
          activo: [""]
        }
      )

    }
    //this.resetObjetoABuscar();

  }

  cambiarCampoDeBusqueda() {
    const opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.buscarComoOption = opcion;
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
  }

  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
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


  buscarPorFiltroSimple() {

    let txtABuscar = this.formularioBusquedaSimple.get('campoBuscar')?.value;
    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.resetObjetoABuscar();
    switch (opcion) {
      case 1:
        this.objetoABuscar.nombre = txtABuscar;
        break;
      case 2:
        this.objetoABuscar.descripcion = txtABuscar;
        break;
      case 3:
        this.objetoABuscar.periodicidadEjecucion = txtABuscar;
        break;
      case 4:
        this.objetoABuscar.fechaInicio = this.dateUtilsService.formatDateToDD_MM_YYYY(txtABuscar);
        break;
      case 5:
        this.objetoABuscar.permitirEjecucionExtemp = txtABuscar;
        break;
      case 6:
        this.objetoABuscar.activo = txtABuscar;
        break;
    }

    this.cargarDataPorBusqueda = true;

    if (this.paginador != undefined) {
      this.paginador.changePage(0);
    }


    this.cargarData(0);

  }


  buscarPorFiltroAvanzado() {

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.resetObjetoABuscar();
    this.objetoABuscar.nombre = this.formularioBusquedaAvanzada.get('nombreProceso')?.value;
    this.objetoABuscar.descripcion = this.formularioBusquedaAvanzada.get('descripcion')?.value;
    this.objetoABuscar.periodicidadEjecucion = this.formularioBusquedaAvanzada.get('ejecucionXPeriodicidad')?.value;
    this.objetoABuscar.fechaInicio = this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioBusquedaAvanzada.get('fechaInicio')?.value);
    this.objetoABuscar.permitirEjecucionExtemp = this.formularioBusquedaAvanzada.get('ejecucionXFechaEspecifica')?.value;
    this.objetoABuscar.activo = this.formularioBusquedaAvanzada.get('activo')?.value;

    this.cargarDataPorBusqueda = true;

    if (this.paginador != undefined) {
      this.paginador.changePage(0);
    }


    this.cargarData(0);


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
        case "fechaInicioVigencia":
          this.nuevaProgramacionProcesos.fechaInicio = "";
          break;
        case "fechaEspecifica":
          this.nuevaProgramacionProcesos.fechaEspecifica = "";
          break;
      }
    }
  }


  cambiarProceso(event: any): void {

    let pagina = Number(event.page);
    if (pagina !== this.currentPage) {
      this.currentPage = pagina;

      this.cargarData(pagina);

    }

  }


  cargarData(index: number) {
    if (this.cargarDataPorBusqueda) {


      this.procesosDefinidosObservable = this.definicionProcesosService
        .busquedaPorFiltro({
          nombre: this.objetoABuscar.nombre,
          descripcion: this.objetoABuscar.descripcion,
          periodicidadEjecucion: this.objetoABuscar.periodicidadEjecucion,
          activo: this.objetoABuscar.activo,
          fechaInicio: this.objetoABuscar.fechaInicio,
          permitirEjecucionExtemp: this.objetoABuscar.permitirEjecucionExtemp
        }, index)
        .subscribe({
          next: (resProcesoDefinido) => {

            if (resProcesoDefinido === undefined) {
              this.busquedaConResultados = false;
              this.inicializarArraysYElementos();
              this.mostrarMensaje("La consulta no encontró registros", "ERROR");
              this.paginador.changePage(0);
              this.procesosDefinidosObservable.unsubscribe();
              //      this.currentPage = 0;
              this.totalElements = 0;

            } else {
              this.busquedaConResultados = true;
              this.procesosDefinidos.consecutivo = resProcesoDefinido.consecutivo;
              this.procesosDefinidos.nombre = resProcesoDefinido.nombre;
              this.procesosDefinidos.descripcion = resProcesoDefinido.descripcion;
              this.procesosDefinidos.fechaInicio = resProcesoDefinido.fechaInicio;
              this.procesosDefinidos.fechaEstado = resProcesoDefinido.fechaEstado;
              this.procesosDefinidos.estado = resProcesoDefinido.estado;
              this.procesosDefinidos.ordenProceso = resProcesoDefinido.ordenProceso;
              this.procesosDefinidos.ordenSubproceso = resProcesoDefinido.ordenSubproceso;
              this.procesosDefinidos.activo = resProcesoDefinido.activo === 'Si' ? 'S' : 'N';
              this.procesosDefinidos.permitirEjecucionExtemp = resProcesoDefinido.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


              // @ts-ignore
              this.procesosDefinidos.periodicidadEjecucion = this.getPeriodicidad(resProcesoDefinido.periodicidadEjecucion)

              this.procesoDefinidoAComparar.consecutivo = resProcesoDefinido.consecutivo;
              // Llenamos el proceso definido a comparar
              this.procesoDefinidoAComparar.activo = resProcesoDefinido.activo === 'Si' ? 'S' : 'N';
              // @ts-ignore
              this.procesoDefinidoAComparar.periodicidadEjecucion = this.getPeriodicidad(resProcesoDefinido.periodicidadEjecucion);
              this.procesoDefinidoAComparar.permitirEjecucionExtemp = resProcesoDefinido.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


              this.tipoProgramacion = resProcesoDefinido.periodicidadEjecucion;
              this.totalElements = this.definicionProcesosService.totalProcesos;
              // this.currentPage = index + 1;


            }


          },
          complete: () => {

            if (this.procesosDefinidos.consecutivo !== 0) {
              this.definicionProcesosService
                .getSubprocesos(this.procesosDefinidos.consecutivo).subscribe({
                next: (res) => {
                  this.procesosDefinidos.subprocesosAsociados = res !== null ? res.sort((a: any, b: any) => (a.ordenSubproceso < b.ordenSubproceso ? -1 : 1))
                    : null;
                }
                ,
                complete: () => {

                  this.definicionProcesosService
                    .getProcesosProgramados(this.procesosDefinidos.consecutivo)
                    .subscribe(res => {
                      this.procesosDefinidos.programacionDeEjecucion = res;

                    })

                },
              })
            }

          }
        });
    } else {

      this.definicionProcesosService
        .getProcesos(index)
        .subscribe({
          next: (resProcesoDefinido) => {
            this.busquedaConResultados = true;
            this.procesosDefinidos.consecutivo = resProcesoDefinido.consecutivo;
            this.procesosDefinidos.nombre = resProcesoDefinido.nombre;
            this.procesosDefinidos.descripcion = resProcesoDefinido.descripcion;
            this.procesosDefinidos.fechaInicio = resProcesoDefinido.fechaInicio;
            this.procesosDefinidos.fechaEstado = resProcesoDefinido.fechaEstado;
            this.procesosDefinidos.estado = resProcesoDefinido.estado;
            this.procesosDefinidos.ordenProceso = resProcesoDefinido.ordenProceso;
            this.procesosDefinidos.ordenSubproceso = resProcesoDefinido.ordenSubproceso;
            this.procesosDefinidos.activo = resProcesoDefinido.activo === 'Si' ? 'S' : 'N';
            this.procesosDefinidos.permitirEjecucionExtemp = resProcesoDefinido.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


            this.procesoDefinidoAComparar.consecutivo = resProcesoDefinido.consecutivo;
            // @ts-ignore
            this.procesosDefinidos.periodicidadEjecucion = this.getPeriodicidad(resProcesoDefinido.periodicidadEjecucion)


            // Llenamos el proceso definido a comparar
            this.procesoDefinidoAComparar.activo = resProcesoDefinido.activo === 'Si' ? 'S' : 'N';
            // @ts-ignore
            this.procesoDefinidoAComparar.periodicidadEjecucion = this.getPeriodicidad(resProcesoDefinido.periodicidadEjecucion)
            this.procesoDefinidoAComparar.permitirEjecucionExtemp = resProcesoDefinido.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


            this.tipoProgramacion = resProcesoDefinido.periodicidadEjecucion;
            this.totalElements = this.definicionProcesosService.totalProcesos;
            //  this.currentPage = index + 1;
          },
          complete: () => {

            this.definicionProcesosService
              .getSubprocesos(this.procesosDefinidos.consecutivo).subscribe({
              next: (res) => {
                this.procesosDefinidos.subprocesosAsociados = res !== null ? res.sort((a: any, b: any) => (a.ordenSubproceso < b.ordenSubproceso ? -1 : 1))
                  : null;
              }
              ,
              complete: () => {

                this.definicionProcesosService
                  .getProcesosProgramados(this.procesosDefinidos.consecutivo)
                  .subscribe(res => {
                    this.procesosDefinidos.programacionDeEjecucion = res;

                  })

              },
            })

          }
        });
    }
  }


  inicializarArraysYElementos() {

    this.procesosDefinidos = {
      consecutivo: 0,
      nombre: "",
      descripcion: "",
      periodicidadEjecucion: "",
      fechaInicio: "",
      permitirEjecucionExtemp: "",
      activo: "",
      pantalla: "",
      ordenSubproceso: "",
      estado: "",
      fechaEstado: "",
      ordenProceso: 0,
      procesoPadreConsecutivo: "",
      programacionDeEjecucion: [],
      subprocesosAsociados: []
    }

    this.procesoDefinidoAComparar = {
      consecutivo: 0,
      nombre: "",
      descripcion: "",
      periodicidadEjecucion: "",
      fechaInicio: "",
      permitirEjecucionExtemp: "",
      activo: "",
      pantalla: "",
      ordenSubproceso: "",
      estado: "",
      fechaEstado: "",
      ordenProceso: 0,
      procesoPadreConsecutivo: "",
      programacionDeEjecucion: [],
      subprocesosAsociados: []
    }

    this.nuevaProgramacionProcesos = {
      fechaInicio: null,
      diaMes: null,
      alternada: null,
      soloDiaHabil: null,
      domingo: null,
      lunes: null,
      martes: null,
      miercoles: null,
      jueves: null,
      viernes: null,
      sabado: null,
      diaSemana: null,
      fechaEspecifica: null,
      procesosConsecutivo: null
    }

  }

  grabarProceso() {
    if (this.validarCambiosEnProcesoDefinidoActual()) {

      const proceso: ProcesoPadreRequest = {
        consecutivo: this.procesosDefinidos.consecutivo,
        periodicidadEjecucion: this.procesosDefinidos.periodicidadEjecucion,
        permitirEjecucionExtemp: this.procesosDefinidos.permitirEjecucionExtemp,
        activo: this.procesosDefinidos.activo
      }

      this.definicionProcesosService
        .updateProceso(proceso).subscribe(
        procesoActualizado => {
          if (procesoActualizado !== null && procesoActualizado !== undefined) {

            // @ts-ignore
            this.procesosDefinidos.activo = procesoActualizado.activo === 'Si' ? 'S' : 'N';
            // @ts-ignore
            this.procesosDefinidos.periodicidadEjecucion = this.getPeriodicidad(procesoActualizado.periodicidadEjecucion);
            this.procesosDefinidos.permitirEjecucionExtemp = procesoActualizado.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


            this.procesoDefinidoAComparar.activo = procesoActualizado.activo === 'Si' ? 'S' : 'N';
            // @ts-ignore
            this.procesoDefinidoAComparar.periodicidadEjecucion = this.getPeriodicidad(procesoActualizado.periodicidadEjecucion);
            this.procesoDefinidoAComparar.permitirEjecucionExtemp = procesoActualizado.permitirEjecucionExtemp === 'Si' ? 'S' : 'N';


            this.mostrarMensaje("Transacción Exitosa", 'SUCCESS');
          }
        }
      );
    }
  }


  getPeriodicidad(type: string): string | undefined {
    return {
      'Diario': 'DI',
      'Semanal': 'SE',
      'Mensual': 'ME',
    }[type];
  }

  crearNuevaProgramacion() {

    this.nuevaProgramacionProcesos = {
      fechaInicio: null,
      diaMes: null,
      alternada: null,
      soloDiaHabil: null,
      domingo: null,
      lunes: null,
      martes: null,
      miercoles: null,
      jueves: null,
      viernes: null,
      sabado: null,
      diaSemana: null,
      fechaEspecifica: null,
      procesosConsecutivo: null
    }


    this.mostrarModalNuevaProgramacion = true;

  }


  validarCambiosEnProcesoDefinidoActual(): boolean {
    if (this.procesosDefinidos.periodicidadEjecucion === '') {
      this.mostrarMensaje("Ejecución x Periodicidad - Selección necesaria.", "ERROR");
      return false
    } else if (this.procesosDefinidos.permitirEjecucionExtemp === '') {
      this.mostrarMensaje("¿Ejecución por Fecha Específica? - Selección necesaria.", "ERROR");
      return false
    } else if (this.procesosDefinidos.activo === '') {
      this.mostrarMensaje("¿Activo? - Selección necesaria.", "ERROR");
      return false
    } else if (this.procesoDefinidoAComparar.periodicidadEjecucion !== this.procesosDefinidos.periodicidadEjecucion
      || this.procesoDefinidoAComparar.permitirEjecucionExtemp !== this.procesosDefinidos.permitirEjecucionExtemp
      || this.procesoDefinidoAComparar.activo !== this.procesosDefinidos.activo) {
      return true;
    }

    this.mostrarMensaje("Nada para guardar", 'ERROR');
    return false;
  }


  guardarNuevaProgramacion() {

    if (this.validarNuevaProgramacionAGuardar()) {

      const fechaInicialInicio = this.nuevaProgramacionProcesos.fechaInicio;
      const fechaInicialEspecifica = this.nuevaProgramacionProcesos.fechaEspecifica;


      this.nuevaProgramacionProcesos.procesosConsecutivo = this.procesosDefinidos.consecutivo.toString();
      //@ts-ignore
      this.nuevaProgramacionProcesos.fechaInicio = this.dateUtilsService.formatDateToDD_MM_YYYY(this.nuevaProgramacionProcesos.fechaInicio);
      if (this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'S') {
        //@ts-ignore
        this.nuevaProgramacionProcesos.fechaEspecifica = this.dateUtilsService.formatDateToDD_MM_YYYY(this.nuevaProgramacionProcesos.fechaEspecifica);
        //TODO
      }

      this.definicionProcesosService
        .guardarNuevaProgramacionProceso(this.nuevaProgramacionProcesos)
        .subscribe(res => {

          if (res != null || res != undefined) {
            this.procesosDefinidos.programacionDeEjecucion.push(res);
            this.mostrarModalNuevaProgramacion = false;
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
          }
        })
      this.nuevaProgramacionProcesos.fechaInicio = fechaInicialInicio;
      this.nuevaProgramacionProcesos.fechaEspecifica = fechaInicialEspecifica;
    }
  }


  validarNuevaProgramacionAGuardar() {

    let resValidacion = true;
    let mensaje = "Fallos de validación de pantalla: <br>";

// Validaciones campos vacios formulario.
    if (this.nuevaProgramacionProcesos.fechaInicio === '' || this.nuevaProgramacionProcesos.fechaInicio === null) {
      mensaje = mensaje + "* Fecha inicio vigencia - se debe introducir un valor. <br>";
      resValidacion = false;
    }

    if (this.nuevaProgramacionProcesos.alternada === '' || this.nuevaProgramacionProcesos.alternada === null) {
      mensaje = mensaje + "* ¿Programación Alterna? - Se debe seleccionar un valor. <br>";

      resValidacion = false;
    }


    if (this.tipoProgramacion === 'Diario' && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'N') {

      if (this.nuevaProgramacionProcesos.soloDiaHabil === '' || this.nuevaProgramacionProcesos.soloDiaHabil === null) {
        mensaje = mensaje + "* ¿Sólo Días Hábiles? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }
    } else if (this.tipoProgramacion === 'Semanal' && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'N') {

      if (this.nuevaProgramacionProcesos.domingo === '' || this.nuevaProgramacionProcesos.domingo === null) {
        mensaje = mensaje + "* ¿Domingo? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }

      if (this.nuevaProgramacionProcesos.lunes === '' || this.nuevaProgramacionProcesos.lunes === null) {
        mensaje = mensaje + "* ¿Lunes? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }

      if (this.nuevaProgramacionProcesos.martes === '' || this.nuevaProgramacionProcesos.martes === null) {
        mensaje = mensaje + "* ¿Martes? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }

      if (this.nuevaProgramacionProcesos.miercoles === '' || this.nuevaProgramacionProcesos.miercoles === null) {
        mensaje = mensaje + "* ¿Miércoles? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }
      if (this.nuevaProgramacionProcesos.jueves === '' || this.nuevaProgramacionProcesos.jueves === null) {
        mensaje = mensaje + "* ¿Jueves? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }
      if (this.nuevaProgramacionProcesos.viernes === '' || this.nuevaProgramacionProcesos.viernes === null) {
        mensaje = mensaje + "* ¿Viernes? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }
      if (this.nuevaProgramacionProcesos.sabado === '' || this.nuevaProgramacionProcesos.sabado === null) {
        mensaje = mensaje + "* ¿Sábado? - Se debe seleccionar un valor. <br>";
        resValidacion = false;
      }
    } else if (this.tipoProgramacion === 'Mensual' && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'N') {

      if (this.nuevaProgramacionProcesos.diaMes === '' || this.nuevaProgramacionProcesos.diaMes === null) {
        mensaje = mensaje + "* Día del mes - Se debe introducir un valor.";
        resValidacion = false;
      }
    }


    if (!resValidacion) {
      this.mostrarMensaje(mensaje, 'ERROR');
      return false;
    }


    //@ts-ignore
    if (((this.tipoProgramacion === 'Mensual' && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'N')) && new RegExp(/^[0-9]*$/).test(parseInt(this.nuevaProgramacionProcesos.diaMes)) === false || isNaN(this.nuevaProgramacionProcesos.diaMes)) {
      this.mostrarMensaje("Día del Mes - No es un número.", "ERROR");
      return false;
    }


// Cuando la fecha especifica tiene como valor Si (S)
    if ((this.nuevaProgramacionProcesos.fechaEspecifica === '' ||
        this.nuevaProgramacionProcesos.fechaEspecifica === null)
      && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'S') {
      this.mostrarMensaje("Error: [KEP20118 Error al crear la programación <br> del proceso. Causa: La fecha específica no <br> puede ser vacía. Solución: Ingrese la fecha específica. ]", "ERROR");
      return false;
    }


    //@ts-ignore
    if (new Date(this.nuevaProgramacionProcesos.fechaInicio).getDate() < new Date().getDate()) {
      this.mostrarMensaje("Error: [KEP20114 Error al crear la programación del proceso. <br>"
        + "Causa: La fecha de Inicio de Vigencia no puede ser menor a la fecha actual."
        + " Solución: Ingrese una fecha de Inicio de Vigencia válida. ]", "ERROR");
      return false;
      //@ts-ignore
    } else if (new Date(this.nuevaProgramacionProcesos.fechaEspecifica).getDate() < new Date().getDate() && this.procesoDefinidoAComparar.permitirEjecucionExtemp === 'S') {
      this.mostrarMensaje("Error: [KEP20115 Error al crear la programación del proceso. <br>"
        + "Causa: La Fecha Específica no puede ser menor a la Fecha de Inicio de Vigencia. <br> "
        + "Solución: Ingrese una Fecha Específica válida. ]", "ERROR");
      return false;
    }

    //@ts-ignore
    if ((this.tipoProgramacion === 'Mensual') && (parseInt(this.nuevaProgramacionProcesos.diaMes) <= 0 || parseInt(this.nuevaProgramacionProcesos.diaMes) > 31)) {

      this.mostrarMensaje("Error: [KEP20110 El Día del Mes está por fuera del rango permitido. <br>"
        + "Causa: Se digitó un Día del Mes menor o igual a 0 ó mayor a 31. Solución:"
        + "Digite un valor válido para el Día del Mes. ]", "ERROR");
      return false;
    }


    return resValidacion;
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


  validacionCamposFormularios(): boolean {

    if (this.busquedaSimple) {
      if ((this.buscarComoOption === 4) && this.formularioBusquedaSimple.get('campoBuscar')?.value === null) {
        this.mostrarMensaje("Fecha Inicio - No es una fecha.", 'ERROR');
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        return false;
      }
    } else {

      if (this.formularioBusquedaAvanzada.get('fechaInicio')?.value === null) {

        this.formularioBusquedaAvanzada.get('fechaInicio')?.setValue("");
        this.mostrarMensaje("Fecha Inicio - No es una fecha.", 'ERROR');
        return false;
      }

    }
    return true;
  }


  resetObjetoABuscar() {
    this.objetoABuscar = {
      consecutivo: 0,
      nombre: "",
      descripcion: "",
      periodicidadEjecucion: "",
      fechaInicio: "",
      permitirEjecucionExtemp: "",
      activo: "",
      pantalla: "",
      ordenSubproceso: 0,
      estado: "",
      fechaEstado: "",
      ordenProceso: 0,
      procesoPadreConsecutivo: 0
    }
  }

  validCantidadCaracteres() {
    if (this.nuevaProgramacionProcesos.diaMes?.toString().length === 2) {
      this.nuevaProgramacionProcesos.diaMes = this.nuevaProgramacionProcesos.diaMes.toString().slice(0, -1);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
