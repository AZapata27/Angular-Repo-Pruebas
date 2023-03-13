import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MensajeService } from 'app/core/services/mensaje.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ParametrosComunesResponse } from '../model/response/parametros-comunes-response';
import { LazyLoadEvent, PrimeNGConfig } from 'primeng/api';
import { ParametroComunRequest } from 'app/features/parametros/model/request/parametro-comun-request';
import { ParametroComunGuardarRequest } from 'app/features/parametros/model/request/parametro-comun-guardar-request';
import { Paginator } from 'primeng/paginator';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { estadoParametro } from 'app/features/parametros/model/enums/estado-parametro';
import { perfilesS3 } from "../../../shared/models/enums/perfiles-S3";
import { RegexPattern } from "../../../shared/models/enums/regex-pattern";
import { DateUtilsService } from "../../../shared/services/date-utils.service";
import { UsuarioService } from "../../../shared/services/usuario.service";
import { ParametrosComunesService } from "../services/parametros-comunes.service";
import { ParametroComun } from "../model/parametro-comun";
import { ValorParametro } from "../model/valor-parametro";


@Component({
  selector: 'app-parametros-comunes',
  templateUrl: './parametros-comunes.component.html'
})
export class ParametrosComunesComponent implements OnInit {

  busquedaSimple: boolean = true;
  opcionesBusqueda: SelectItem[] = [];
  grupoOpciones: SelectItem [] = [];
  tipoValidacionOpciones: SelectItem[] = [];
  multivaluadoOpciones: SelectItem[] = [];
  tipoDatoOpciones: SelectItem [] = [];
  unidadOpciones: SelectItem [] = [];

  campoBusqueda: number = 1;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  formularioNuevoParametroComun!: FormGroup;
  formularioParametrosComunes!: FormGroup;
  formularioNuevoValorParametro!: FormGroup;


  subscription!: Subscription;

  parametroComunSeleccionado: ParametroComun = {} as ParametroComun;
  valorParametroSeleccionado: ValorParametro = {} as ValorParametro;

  parametrosComunesResponse!: ParametrosComunesResponse;
  parametroComunAGuardar: ParametroComunGuardarRequest = {} as ParametroComunGuardarRequest;
  objetoABuscar!: ParametroComunRequest;
  fechaActual = this.dateUtilsService.getDateNowString();
  crearNuevoValorParametro: boolean = false;
  flagCrearNuevoParametroComun: boolean = false;

  cambioEstado = "Creado pendiente por aprobar";
  mostrarDialogDetalles: boolean = false;
  mostrarDialogNuevoParametroComun: boolean = false;
  crearNuevoValorParametroComun: boolean = false;
  mostrarDetalleValoresParametroComun: boolean = false;
  currentPagePaginador: number = 0;
  valorParametroAGuardar: any = {};

  offSetParametrosComunesGeneral: number = 0;

  flagEnableAgregarNuevoParametro: boolean = false;
  flagEnableViewGrabar: boolean = false;


  flagViewNuevoValorParametro: boolean = false;
  flagViewEliminar: boolean = false;
  flagViewInactivar: boolean = false;
  flagViewActivar: boolean = false;
  flagViewGrabar: boolean = false;
  flagViewAprobar: boolean = false;
  flagViewRechazar: boolean = false;

  firsParamComunes: number = 0;

  @ViewChild('paginador', {static: false}) paginadorTablaPrincipal!: Paginator;

  private perfilesUsuario: perfilesS3[] = [];

  public ValidacionRegexEnum = RegexPattern;

  constructor(private parametrosComunesService: ParametrosComunesService,
              private usuarioService: UsuarioService,
              private _formBuilder: FormBuilder,
              private mensajeService: MensajeService,
              private config: PrimeNGConfig,
              private translate: TranslateService,
              private dateUtilsService: DateUtilsService) {


    this.inicializarArraysYElementos();
    this.opcionesBusqueda = parametrosComunesService.getOpcionesBusqueda();
    this.grupoOpciones = parametrosComunesService.getGrupoOpciones();
    this.tipoValidacionOpciones = parametrosComunesService.getTipoValidacionOpciones();
    this.multivaluadoOpciones = parametrosComunesService.getMultiValuadoOpciones();
    this.tipoDatoOpciones = parametrosComunesService.getTipoDatoOpciones();
    this.unidadOpciones = parametrosComunesService.getUnidadMedidaOpciones();
    this.usuarioService.getPerfiles().subscribe(perfilesUsuario => {
      this.perfilesUsuario = perfilesUsuario;
    });
  }


  ngOnInit(): void {
    this.translate.setDefaultLang('es');
    this.createForm();
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });

    this.formularioNuevoParametroComun = this._formBuilder.group({
      codigo: [""],
      nombre: [""],
      descripcion: [""],
      grupo: [""],
      tipoValidacion: [""],
      multivaluado: [""],
      tipoDato: [""],
      longitud: [""],
      unidad: [""],
      precision: [""]
    });

    this.formularioParametrosComunes = this._formBuilder.group({
      descripcion: [""],
      grupo: [""],
      tipoValidacion: [""],
      tipoDato: [""]
    });

    this.formularioNuevoValorParametro = this._formBuilder.group({
      descripcion: [""],
      valor: [""],
      fechaVigencia: [""],
      valorMaximo: [""],
      fechaFinVigencia: [""]
    });

    this.perfilRequeridoAnalista();

  }


  createForm() {
    if (this.busquedaSimple) {
      this.campoBusqueda = 1;
      this.formularioBusquedaSimple = this._formBuilder.group(
        {
          selectedIndice: [1],
          campoBuscar: [""]
        }
      )
    } else {

      this.formularioBusquedaAvanzada = this._formBuilder.group(
        {
          codigo: [""],
          nombre: [""],
          descripcion: [""],
          grupo: [""],
          tipoValidacion: [""],
          multivaluado: [""],
          tipoDato: [""],
          longitud: [""],
          unidad: [""],
          precision: [""]
        }
      )
    }
    // this.resetObjetoABuscar();
  }


  cambiarCampoDeBusqueda() {
    this.campoBusqueda = Number.parseInt(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
    this.formularioBusquedaSimple.get("campoBuscar")?.setErrors(null);
  }

  buscarPorFiltroSimple() {

    if (!this.validacionCamposFormularios()) {
      return;
    }

    let txtABuscar: string = this.formularioBusquedaSimple.get('campoBuscar')?.value;
    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);

    this.resetObjetoABuscar();

    switch (opcion) {
      case 1:
        this.objetoABuscar.codigo = txtABuscar.toUpperCase();
        break;
      case 2:
        this.objetoABuscar.nombre = txtABuscar.toUpperCase();
        break;
      case 3:
        this.objetoABuscar.descripcion = txtABuscar.toUpperCase();
        break;
      case 4:
        this.objetoABuscar.grupo = txtABuscar;
        break;
      case 5:
        this.objetoABuscar.tipoValidacion = txtABuscar;
        break;
      case 6:
        this.objetoABuscar.multivaluado = txtABuscar;
        break;
      case 7:
        this.objetoABuscar.tipoDato = txtABuscar;
        break;
      case 8:
        this.objetoABuscar.longitud = txtABuscar;
        break;
      case 9:
        this.objetoABuscar.unidad = txtABuscar;
        break;
      case 10:
        this.objetoABuscar.precision = txtABuscar;
        break;

    }

    this.objetoABuscar.size = 10;
    this.cargarData(10, 0, 1);

  }

  buscarPorFiltroAvanzado() {

    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.resetObjetoABuscar();
    this.objetoABuscar = {
      codigo: String(this.formularioBusquedaAvanzada.get('codigo')?.value).toUpperCase(),
      nombre: String(this.formularioBusquedaAvanzada.get('nombre')?.value).toUpperCase(),
      descripcion: String(this.formularioBusquedaAvanzada.get('descripcion')?.value).toUpperCase(),
      grupo: this.formularioBusquedaAvanzada.get('grupo')?.value,
      tipoValidacion: this.formularioBusquedaAvanzada.get('tipoValidacion')?.value,
      multivaluado: this.formularioBusquedaAvanzada.get('multivaluado')?.value,
      tipoDato: this.formularioBusquedaAvanzada.get('tipoDato')?.value,
      longitud: this.formularioBusquedaAvanzada.get('longitud')?.value,
      unidad: this.formularioBusquedaAvanzada.get('unidad')?.value,
      precision: this.formularioBusquedaAvanzada.get('precision')?.value,
      page: 0,
      size: 0
    }

    // this.turboTable._totalRecords = 0;
    this.objetoABuscar.size = 10;
    this.cargarData(10, 0, 1);

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


  crearNuevoParametroComun() {
    this.mostrarDialogNuevoParametroComun = true;
    this.flagCrearNuevoParametroComun = true;
    this.formularioNuevoParametroComun.get('codigo')?.enable();
    this.formularioNuevoParametroComun.get('nombre')?.enable();
    this.formularioNuevoParametroComun.get('multivaluado')?.enable();
    this.formularioNuevoParametroComun.get('longitud')?.enable();
    this.formularioNuevoParametroComun.get('unidad')?.enable();
    this.formularioNuevoParametroComun.get('precision')?.enable();

    this.formularioNuevoParametroComun = this._formBuilder.group({
      codigo: [""],
      nombre: [""],
      descripcion: [""],
      grupo: [""],
      tipoValidacion: [""],
      multivaluado: [""],
      tipoDato: [""],
      longitud: [""],
      unidad: [""],
      precision: [""]
    });

    this.flagEnableAgregarNuevoParametro = true;
    if (this.valorParametroSeleccionado.estado !== 'VIG' &&
      this.valorParametroSeleccionado.estado !== 'RPA' &&
      !this.crearNuevoValorParametro) {
      this.flagEnableViewGrabar = false;
    }

  }


  mostrarDialogDetallesParamatero() {
    if (this.parametroComunSeleccionado.consecutivo !== 0) {
      this.mostrarDialogDetalles = true;
      //TODO
      this.setValuesFormulario();

      this.currentPagePaginador = this.parametrosComunesResponse.content.indexOf(this.parametroComunSeleccionado);
      this.paginadorTablaPrincipal.changePage(this.currentPagePaginador);

    }
  }

  deSeleccionarFila() {
    this.parametroComunSeleccionado = {
      consecutivo: 0,
      tipo: "",
      codigo: "",
      nombre: "",
      descripcion: "",
      grupo: "",
      tipoValidacion: "",
      multivaluado: "",
      tipoDato: "",
      longitud: 0,
      unidad: "",
      precision: 0,
      valoresParametros: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0
      }
    };
  }

  seleccionarFilaParamComunes(parametroComunSeleccionado: ParametroComun) {
    this.parametroComunSeleccionado = parametroComunSeleccionado;
    if (this.parametroComunSeleccionado.consecutivo !== 0) {
      this.setValuesFormulario();

      //TODO
      this.currentPagePaginador = this.parametrosComunesResponse.content.indexOf(this.parametroComunSeleccionado);
      this.paginadorTablaPrincipal.changePage(this.currentPagePaginador);

      this.mostrarDialogDetalles = true;

    }
  }

  cargarData(size: number, page: number, pagination: number) {

    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.parametrosComunesService
        .getParametrosComunBusqueda(this.objetoABuscar)
        .subscribe(res => {
          if (res.content.length > 0) {
            this.parametrosComunesResponse = res;
            this.offSetParametrosComunesGeneral = res.pageable.offset + 1;
            if (pagination != 0) {
              this.firsParamComunes = 0;
            }
          } else {
            this.mostrarMensaje("La consulta no encontró registros", 'ERROR');
            this.inicializarArraysYElementos();
            if (pagination != 0) {
              this.firsParamComunes = 0;
            }
          }
        });

    } else {
      this.parametrosComunesService
        .getParametrosComunes(size, page)
        .subscribe(res => {
          this.parametrosComunesResponse = res;
          this.offSetParametrosComunesGeneral = res.pageable.offset + 1;
          if (pagination != 0) {
            this.firsParamComunes = 0;
          }
        });

    }
  }


  cambiarPageParametrosComunes(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;
    this.cargarData(10, pageIndex, 0);
  }

  inicializarArraysYElementos() {
    this.parametroComunSeleccionado = {
      consecutivo: 0,
      tipo: "",
      codigo: "",
      nombre: "",
      descripcion: "",
      grupo: "",
      tipoValidacion: "",
      multivaluado: "",
      tipoDato: "",
      longitud: 0,
      unidad: "",
      precision: 0,
      valoresParametros: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0
      }
    };

    this.parametrosComunesResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    }

    this.resetObjetoABuscar();

  }


  resetObjetoABuscar() {
    this.objetoABuscar = {
      codigo: "",
      nombre: "",
      descripcion: "",
      grupo: "",
      tipoValidacion: "",
      multivaluado: "",
      tipoDato: "",
      longitud: "",
      unidad: "",
      precision: "",
      page: 0,
      size: 0
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


  cambiarPageParametroComunSeleccionado(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    if (this.currentPagePaginador !== pageIndex) {
      this.currentPagePaginador = pageIndex;
      this.parametrosComunesService
        .getParametrosComunes(1, pageIndex).subscribe(res => {
        this.parametroComunSeleccionado = res.content[0];
        this.setValuesFormulario();

      });
    }
  }

  mostrarDetalleValoresParametro() {
    this.flagEnableViewGrabar = true;
    this.flagViewNuevoValorParametro = false;
    if (this.valorParametroSeleccionado.parConsecutivo !== 0) {
      this.mostrarDetalleValoresParametroComun = true;
      this.crearNuevoValorParametro = false;
      this.formularioNuevoParametroComun.reset();

      //Insertamos los valores en el formulario
      this.formularioNuevoValorParametro.get('valor')?.setValue(this.valorParametroSeleccionado.valor);
      this.formularioNuevoValorParametro.get('fechaVigencia')?.setValue(this.valorParametroSeleccionado.fechaVigencia);
      this.formularioNuevoValorParametro.get('fechaFinVigencia')?.setValue(this.valorParametroSeleccionado.fechaFinVigencia);
      this.formularioNuevoValorParametro.get('valorMaximo')?.setValue(this.valorParametroSeleccionado.valorMaximo);
    }
  }

  agregarNuevoValorParametro() {
    this.crearNuevoValorParametroComun = true;
    this.crearNuevoValorParametro = false;
    this.flagViewNuevoValorParametro = true;
    this.flagEnableViewGrabar = false;
    this.formularioNuevoValorParametro.reset();
  }

  grabarParametroComun() {

    this.parametroComunAGuardar.codigo = this.formularioNuevoParametroComun.get('codigo')?.value;
    this.parametroComunAGuardar.descripcion = this.formularioNuevoParametroComun.get('descripcion')?.value;
    this.parametroComunAGuardar.grupo = this.formularioNuevoParametroComun.get('grupo')?.value;
    this.parametroComunAGuardar.longitud = this.formularioNuevoParametroComun.get('longitud')?.value;
    this.parametroComunAGuardar.multivaluado = this.formularioNuevoParametroComun.get('multivaluado')?.value;
    this.parametroComunAGuardar.nombre = this.formularioNuevoParametroComun.get('nombre')?.value;
    this.parametroComunAGuardar.precision = this.formularioNuevoParametroComun.get('precision')?.value;
    this.parametroComunAGuardar.tipoDato = this.formularioNuevoParametroComun.get('tipoDato')?.value;
    this.parametroComunAGuardar.tipoValidacion = this.formularioNuevoParametroComun.get('tipoValidacion')?.value;
    this.parametroComunAGuardar.unidad = this.formularioNuevoParametroComun.get('unidad')?.value;


    this.parametrosComunesService.crearParametroComun(this.parametroComunAGuardar)
      .subscribe(res => {
        if (res !== null && res.consecutivo !== 0) {

          this.parametroComunSeleccionado.codigo = res.codigo;
          this.parametroComunSeleccionado.nombre = res.nombre;
          this.parametroComunSeleccionado.descripcion = res.descripcion;

          this.flagCrearNuevoParametroComun = false;
          this.formularioNuevoParametroComun.get('codigo')?.disable();
          this.formularioNuevoParametroComun.get('nombre')?.disable();
          this.formularioNuevoParametroComun.get('multivaluado')?.disable();
          this.formularioNuevoParametroComun.get('longitud')?.disable();
          this.formularioNuevoParametroComun.get('unidad')?.disable();
          this.formularioNuevoParametroComun.get('precision')?.disable();
          this.mostrarMensaje("Transacción Exitosa", "SUCCESS");
          this.flagEnableAgregarNuevoParametro = false;
        }

      });

  }


  setValuesFormulario() {
    const grupoIndex = this.grupoOpciones
      .filter(p => {
        return p.label === this.parametroComunSeleccionado.grupo.toString();
      }).map(paramComun => paramComun.value)[0];

    const tipoValidacionIndex = this.tipoValidacionOpciones
      .filter(p => {
        return p.label === this.parametroComunSeleccionado.tipoValidacion.toString();
      }).map(paramComun => paramComun.value)[0];

    const tipoDato = this.tipoDatoOpciones
      .filter(p => {
        return p.label === this.parametroComunSeleccionado.tipoDato.toString();
      }).map(paramComun => paramComun.value)[0];


    this.formularioParametrosComunes.controls['descripcion'].setValue(this.parametroComunSeleccionado.descripcion, {onlySelf: true});
    this.formularioParametrosComunes.controls['grupo'].setValue(grupoIndex, {onlySelf: true});
    this.formularioParametrosComunes.controls['tipoValidacion'].setValue(tipoValidacionIndex, {onlySelf: true});
    this.formularioParametrosComunes.controls['tipoDato'].setValue(tipoDato, {onlySelf: true});


  }

  editarOcrearParametroComun() {

    const parametroComun = {
      consecutivo: this.parametroComunSeleccionado.consecutivo,
      descripcion: this.formularioParametrosComunes.get('descripcion')?.value,
      grupo: this.formularioParametrosComunes.get('grupo')?.value,
      tipoValidacion: this.formularioParametrosComunes.get('tipoValidacion')?.value,
      tipoDato: this.formularioParametrosComunes.get('tipoDato')?.value,
      longitud: this.parametroComunSeleccionado.longitud,
      unidad: this.getUnidad(this.parametroComunSeleccionado.unidad),
      precision: this.parametroComunSeleccionado.precision
    }

    this.parametrosComunesService
      .updateParametroComun(this.parametroComunSeleccionado.consecutivo, parametroComun)
      .subscribe(res => {

        this.parametroComunSeleccionado.descripcion = res.descripcion;
        this.parametroComunSeleccionado.nombre = res.nombre;
        this.parametroComunSeleccionado.grupo = res.grupo;
        this.parametroComunSeleccionado.tipoValidacion = res.tipoValidacion;
        this.parametroComunSeleccionado.tipoDato = res.tipoDato;

        this.mostrarMensaje("Transacción Exitosa", "SUCCESS");
      });
  }

  validarFechas(event: any, campo: string) {
    if (new RegExp(/^[0-9]|[-]$/).test(event.data) === false) {
      switch (campo) {
        case "fechaVigencia":
          this.formularioNuevoValorParametro.get('fechaVigencia')?.setValue('');
          break;
        case "fechaFinVigencia":
          this.formularioNuevoValorParametro.get('fechaFinVigencia')?.setValue('');
      }
    }
  }


  getUnidad(type: string): string | undefined {
    return {
      "AÑOS": "AN",
      "Cantidad": "CA",
      "Dias": "DI",
      "FACTOR": "FA",
      "HORAS": "HO",
      "MESES": "ME",
      "Porcentaje": "PO",
      "TASAS": "TA",
      "Valor": "VA"
    }[type];
  }

  getEstadoValorParametro(type: string) {
    if (type === '' || type === undefined) {
      return;
    }


    const values = Object.entries(estadoParametro).map(([key, value]) => ({id: key, value: value}));

    return values
      .filter(estado => estado.id === type)[0].value;

  }


  cambiarPageValoresParametro(event: LazyLoadEvent) {

    if (this.mostrarDialogDetalles) {
      // @ts-ignore: Object is possibly 'null'.
      let pageIndex = event.first / event.rows;

      this.parametrosComunesService
        .getValoresParametrosDeParametroComun(this.parametroComunSeleccionado.consecutivo, pageIndex)
        .subscribe(data => {
          this.parametroComunSeleccionado.valoresParametros.content = data.content;
        });
    }
  }

  editarOcrearValorParametro() {

    this.cargarValorParametro();

    if (this.crearNuevoValorParametro) {

      this.parametrosComunesService
        .crearValorParametro(this.parametroComunSeleccionado.consecutivo, this.valorParametroAGuardar)
        .subscribe(valorParam => {
          if (valorParam !== null && valorParam !== undefined) {
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
            this.parametroComunSeleccionado.valoresParametros.content.push(valorParam);
            this.flagViewNuevoValorParametro = false;
            this.flagEnableViewGrabar = true;
            this.valorParametroSeleccionado.estado = valorParam.estado;
            this.valorParametroSeleccionado.fechaEstado = valorParam.fechaEstado;
            this.valorParametroSeleccionado.valor = valorParam.valor;
          }
        });

    } else {

      this.parametrosComunesService
        .updateValorParametro(this.parametroComunSeleccionado.consecutivo, this.valorParametroAGuardar, "MODIFICAR")
        .subscribe(valorParam => {
          if (valorParam !== null && valorParam !== undefined) {
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
            this.valorParametroSeleccionado.estado = valorParam.estado;
            this.valorParametroSeleccionado.fechaEstado = valorParam.fechaEstado;
            this.valorParametroSeleccionado.valor = valorParam.valor;
            this.valorParametroSeleccionado.valorMaximo = valorParam.valorMaximo;
            this.flagViewNuevoValorParametro = false;
            this.flagEnableViewGrabar = true;

          }
        });
    }

  }


  creacionValorParametro() {

    this.cargarValorParametro();

    if (this.crearNuevoValorParametroComun) {

      this.parametrosComunesService
        .crearValorParametro(this.parametroComunSeleccionado.consecutivo, this.valorParametroAGuardar)
        .subscribe(valorParam => {
          if (valorParam !== null && valorParam !== undefined) {
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
            this.parametroComunSeleccionado.valoresParametros.content.push(valorParam);
            this.flagViewNuevoValorParametro = false;
            this.flagEnableViewGrabar = true;
            this.cambioEstado = "Pendiente por aprobar";
            this.fechaActual = valorParam.fechaEstado;


          }
        });

    }
  }


  validacionCamposFormularios() {
    let resultadoValidacionFormBusqueda = true;

    if (this.busquedaSimple) {

      if (isNaN(this.formularioBusquedaSimple.get('campoBuscar')?.value) &&
        (Number(this.formularioBusquedaSimple.get('selectedIndice')?.value) === 8 ||
          Number(this.formularioBusquedaSimple.get('selectedIndice')?.value) === 10)) {
        this.mostrarMensaje("Error: Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico", "ERROR");
        resultadoValidacionFormBusqueda = false;
      }
    } else {
      if (isNaN(this.formularioBusquedaAvanzada.get('longitud')?.value) ||
        isNaN(this.formularioBusquedaAvanzada.get('precision')?.value)) {
        this.mostrarMensaje("Error: Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico", "ERROR");
        resultadoValidacionFormBusqueda = false;
      }
    }
    return resultadoValidacionFormBusqueda;
  }

  deSeleccionarFilarValoresParametro() {
    this.valorParametroSeleccionado = {
      parConsecutivo: 0,
      numero: 0,
      descripcion: "",
      valor: "",
      fechaVigencia: "",
      valorMaximo: "",
      fechaFinVigencia: "",
      estado: "",
      fechaEstado: ""
    };
  }

  seleccionarFilaValoresParametro(valorParametroSeleccionado: ValorParametro) {
    this.flagViewNuevoValorParametro = false;
    this.flagEnableViewGrabar = true;
    this.valorParametroSeleccionado = valorParametroSeleccionado;

    this.mostrarDetalleValoresParametroComun = true;
    this.crearNuevoValorParametro = false;
    this.formularioNuevoParametroComun.reset();

    //Insertamos los valores en el formulario
    this.formularioNuevoValorParametro.get('descripcion')?.setValue(this.valorParametroSeleccionado.descripcion);
    this.formularioNuevoValorParametro.get('numero')?.setValue(this.valorParametroSeleccionado.numero);
    this.formularioNuevoValorParametro.get('valor')?.setValue(this.valorParametroSeleccionado.valor);
    this.formularioNuevoValorParametro.get('fechaVigencia')?.setValue(this.valorParametroSeleccionado.fechaVigencia);
    this.formularioNuevoValorParametro.get('fechaFinVigencia')?.setValue(this.valorParametroSeleccionado.fechaFinVigencia);
    this.formularioNuevoValorParametro.get('valorMaximo')?.setValue(this.valorParametroSeleccionado.valorMaximo);

  }

  cargarValorParametro() {
    this.valorParametroAGuardar = {

      descripcion: this.formularioNuevoValorParametro.get('descripcion')?.value,
      numero: this.valorParametroSeleccionado.numero,
      valor: this.formularioNuevoValorParametro.get('valor')?.value,
      fechaVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaVigencia')?.value),
      valorMaximo: this.formularioNuevoValorParametro.get('valorMaximo')?.value,
      fechaFinVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaFinVigencia')?.value),

    }

  }


  updateValorParametroPorEvento(evento: string) {
    this.flagEnableViewGrabar = true;
    this.flagViewNuevoValorParametro = false;
    this.cargarValorParametro();
    this.parametrosComunesService
      .updateValorParametro(this.parametroComunSeleccionado.consecutivo, this.valorParametroAGuardar, evento)
      .subscribe(valorParam => {
        if (valorParam !== null && valorParam !== undefined) {

          let mensaje = "";
          if (valorParam.info !== undefined && valorParam.info !== null) {
            mensaje = `Transacción Exitosa <BR> <BR> ${valorParam.info}`;
          } else {
            mensaje = "Transacción Exitosa";
          }

          this.mostrarMensaje(mensaje, "SUCCESS");
          this.valorParametroSeleccionado.estado = valorParam.estado;
          this.valorParametroSeleccionado.fechaEstado = valorParam.fechaEstado;
        }
      });
  }


  perfilRequeridoAnalista(): void {

    var perfilS3 = this.perfilesUsuario.indexOf(perfilesS3.ANALISTA) != -1;
    this.flagViewNuevoValorParametro = perfilS3;
    this.flagViewEliminar = perfilS3;
    this.flagViewInactivar = perfilS3;
    this.flagViewActivar = perfilS3;
    this.flagViewGrabar = perfilS3;
    this.flagViewAprobar = perfilS3;
    this.flagViewRechazar = perfilS3;

    //return this.perfilesUsuario.indexOf(perfilesS3Enum.ANALISTA) != -1;

  }


}

