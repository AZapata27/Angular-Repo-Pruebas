import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MensajeService } from 'app/core/services/mensaje.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ParametrosComunesService } from '../../../core/services/parametros-comunes.service';
import { ParametroComun } from '../../../core/models/parametroComun.interface';
import { ParametrosComunesResponse } from '../../../core/models/response/ParametrosComunes.response';
import { LazyLoadEvent, PrimeNGConfig } from 'primeng/api';
import { ParametroComunRequest } from 'app/core/models/request/parametroComun.request';
import { ParametroComunAGuardarRequest } from 'app/core/models/request/parametroComunAGuardar.request';
import { Paginator } from 'primeng/paginator';
import { ValorParametro } from 'app/core/models/valorParametro.interface';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { estadoParametroEnum } from 'app/core/enums/estadoParametro.enum';
import { MenuService } from "../../../core/services/menu.service";
import { perfilesS3Enum } from "../../../core/enums/perfilesS3.enum";
import { tipoValidacionEnum } from 'app/core/enums/tipoValidacion.enum';
import { DateUtilsService } from "../../../shared/services/date-utils.service";


@Component({
  selector: 'app-parametros-comunes-pendientes',
  templateUrl: './parametros-comunes-pendientes.component.html'
})
export class ParametrosComunesPendientesComponent implements OnInit {

  busquedaSimple: boolean = true;
  opcionesBusqueda: SelectItem[] = [];
  grupoOpciones: SelectItem[] = [];
  tipoValidacionOpciones: SelectItem[] = [];
  multivaluadoOpciones: SelectItem[] = [];
  tipoDatoOpciones: SelectItem[] = [];
  unidadOpciones: SelectItem[] = [];

  campoBusqueda: number = 1;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  formularioNuevoParametroComun!: FormGroup;
  formularioParametrosComunes!: FormGroup;
  formularioNuevoValorParametro!: FormGroup;


  subscription!: Subscription;

  parametroComunSeleccionado: ParametroComun = {} as ParametroComun;
  parametroComunPendienteSeleccionado: ParametroComun = {} as ParametroComun;

  valorParametroSeleccionado: ValorParametro = {} as ValorParametro;

  parametrosComunesResponse!: ParametrosComunesResponse;
  parametroComunAGuardar: ParametroComunAGuardarRequest = {} as ParametroComunAGuardarRequest;
  objetoABuscar!: ParametroComunRequest;
  fechaActual = this.dateUtilsService.getDateNowString();
  crearNuevoValorParametro: boolean = false;
  flagCrearNuevoParametroComun: boolean = false;

  mostrarDialogDetalles: boolean = false;
  mostrarDialogNuevoParametroComun: boolean = false;
  mostrarDetalleValoresParametroComun: boolean = false;
  currentPagePaginador: number = 0;
  valorParametroAGuardar: any = {};

  offSetParametrosComunesGeneral: number = 0;

  flagEnableBotonAprobar: boolean = false;
  flagEnableBotonRechazar: boolean = false;

  @ViewChild('paginador', {static: false}) paginadorTablaPrincipal!: Paginator;

  private perfilesUsuario: perfilesS3Enum[] = [];


  constructor(private parametrosComunesService: ParametrosComunesService,
              private menuService: MenuService,
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


    this.menuService.getPerfiles().subscribe(perfilesUsuario => {
      this.perfilesUsuario = perfilesUsuario;
    });

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
    this.cargarData(10, 0);

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
    this.cargarData(10, 0);

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

  seleccionarRowParamComunesPendiente(parametroComunPendienteSeleccionado: ParametroComun) {
    this.parametroComunSeleccionado = parametroComunPendienteSeleccionado;
    this.parametroComunPendienteSeleccionado = parametroComunPendienteSeleccionado;
    if (this.parametroComunSeleccionado.consecutivo !== 0) {
      this.mostrarDialogDetalles = true;
      //TODO
      this.setValuesFormulario();

      this.currentPagePaginador = this.parametrosComunesResponse.content.indexOf(this.parametroComunSeleccionado);
      this.paginadorTablaPrincipal.changePage(this.currentPagePaginador);

    }
  }


  cargarData(size: number, page: number) {

    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.parametrosComunesService
        .getParametrosComunBusqueda(this.objetoABuscar)
        .subscribe(res => {
          if (res.content.length > 0) {
            this.parametrosComunesResponse = res;
            this.offSetParametrosComunesGeneral = res.pageable.offset + 1;

          } else {
            this.mostrarMensaje("La consulta no encontró registros", 'ERROR');
            this.inicializarArraysYElementos();
          }
        });

    } else {
      this.parametrosComunesService
        .getParametrosComunesPendientes(size, page)
        .subscribe(res => {
          this.parametrosComunesResponse = res;
          this.offSetParametrosComunesGeneral = res.pageable.offset + 1;

        });

    }
  }


  cambiarPageParametrosComunes(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;
    this.cargarData(10, pageIndex);
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
    if (this.valorParametroSeleccionado.parConsecutivo !== 0) {
      this.mostrarDetalleValoresParametroComun = true;
      this.crearNuevoValorParametro = false;
      this.formularioNuevoParametroComun.reset();

      if (this.valorParametroSeleccionado.estado != 'PPA' &&
        this.valorParametroSeleccionado.estado != 'IPA' &&
        this.valorParametroSeleccionado.estado != 'EPA') {
        this.flagEnableBotonAprobar = true;
        this.flagEnableBotonRechazar = true;
      } else {
        this.flagEnableBotonAprobar = false;
        this.flagEnableBotonRechazar = false;
        if (this.parametroComunPendienteSeleccionado.tipoValidacion == tipoValidacionEnum.DI) {

          this.valorParametroSeleccionado.valor = "";
          this.valorParametroSeleccionado.fechaVigencia = "";
        }
      }

      //Insertamos los valores en el formulario
      this.formularioNuevoValorParametro.get('valor')?.setValue(this.valorParametroSeleccionado.valor);
      this.formularioNuevoValorParametro.get('fechaVigencia')?.setValue(this.valorParametroSeleccionado.fechaVigencia);
      this.formularioNuevoValorParametro.get('fechaFinVigencia')?.setValue(this.valorParametroSeleccionado.fechaFinVigencia);
      this.formularioNuevoValorParametro.get('valorMaximo')?.setValue(this.valorParametroSeleccionado.valorMaximo);

    }
  }


  validarParamaetroComunAGuardar() {
    /**
     * Grupo, tipo Validación, multivaluado,
     tipo dato, unidad -> Select No vacío
     */

    let mensajeValidacionError = "ERROR: ";
    let resValidacion: boolean = true;

    if (this.formularioNuevoParametroComun.get('codigo')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "1. Código - Valor Necesario. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('nombre')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "2. Nombre - Valor Necesario. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('descripcion')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "3. Descripción - Valor Necesario. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('grupo')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "4. Grupo- Selección necesaria. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('tipoValidacion')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "5. Tipo Validación - Selección necesaria. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('multivaluado')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "6. ¿Multivaluado? - Selección necesaria. <br>";
      resValidacion = false;
    }

    if (this.formularioNuevoParametroComun.get('tipoDato')?.value === '') {
      mensajeValidacionError = mensajeValidacionError + "Error: [ El tipo de dato, la longitud, la unidad y la precisión no pueden ser nulos simultáneamente. Causa : El tipo de dato, la longitud, la unidad y precisión tienen valores nulos simultáneamente. Solución: Ingrese el tipo de dato y los valores correspondientes]";
      resValidacion = false;
    }


    if (!resValidacion) {
      this.mostrarMensaje(mensajeValidacionError, "ERROR");
      return resValidacion;
    }


    // Validaciones del negocio
    if (this.formularioNuevoParametroComun.get('tipoDato')?.value === 'CHR'
      && this.formularioNuevoParametroComun.get('longitud')?.value === '') {

      this.mostrarMensaje("Error: [KEP20404 Si el tipo de dato es cadena <br>" +
        "de caracteres el campo longitud no <br> " +
        "debe estar vacío. Causa: Para el tipo de dato <br>" +
        "caracter se debe ingresar la longitud.  <br>" +
        " Solución: Ingrese la longitud. ]", "ERROR");
      return false;

    } else if (this.formularioNuevoParametroComun.get('tipoDato')?.value === 'FEC' &&
      this.formularioNuevoParametroComun.get('longitud')?.value !== ''
      && this.formularioNuevoParametroComun.get('unidad')?.value !== '') {

      this.mostrarMensaje("Error: [KEP20405 Si el tipo de dato <br>" +
        "es fecha los campos longitud y unidad <br>" +
        "deben estar vacíos. Causa: Para el tipo <br>" +
        "de dato fecha no se puede ingresar <br>" +
        "longitud y unidad . Solución: <br>" +
        "No ingrese valores de longitud y unidad . ] <br> ", "ERROR");
      return false;

    }


    return resValidacion;

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

  editarParametroComun() {

    let mensajeErrorValidacion = "Error: <br>";
    let resultadoValidacion = true;

    if (this.formularioParametrosComunes.get('descripcion')?.value === '') {
      mensajeErrorValidacion = mensajeErrorValidacion + "1. Descripción - Valor Necesario.";
      resultadoValidacion = false;
    }

    if (this.formularioParametrosComunes.get('grupo')?.value === '') {
      mensajeErrorValidacion = mensajeErrorValidacion + "2. Grupo - Selección Necesaria.";
      resultadoValidacion = false;
    }

    if (this.formularioParametrosComunes.get('tipoValidacion')?.value === '') {
      mensajeErrorValidacion = mensajeErrorValidacion + "3. Tipo Validación - Selección necesaria.";
      resultadoValidacion = false;
    }

    if (this.formularioParametrosComunes.get('tipoDato')?.value === '') {
      mensajeErrorValidacion = mensajeErrorValidacion + "4. Tipo Dato - Selección necesaria.";
      resultadoValidacion = false;
    }

    if (resultadoValidacion !== true) {
      this.mostrarMensaje(mensajeErrorValidacion, "ERROR");
      return;
    }


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


    const values = Object.entries(estadoParametroEnum).map(([key, value]) => ({id: key, value: value}));
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

  crearValorParametro() {
    //TODO validar

    const valorParametroAGuardar = {
      descripcion: this.formularioNuevoValorParametro.get('descripcion')?.value,
      valor: (this.formularioNuevoValorParametro.get('valor')?.value).toUpperCase(),
      fechaVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaVigencia')?.value),
      valorMaximo: this.formularioNuevoValorParametro.get('valorMaximo')?.value,
      fechaFinVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaFinVigencia')?.value),
      estado: "CRE"
    }

    if (this.crearNuevoValorParametro) {

      this.parametrosComunesService
        .crearValorParametro(this.parametroComunSeleccionado.consecutivo, valorParametroAGuardar)
        .subscribe(valorParam => {
          if (valorParam !== null && valorParam !== undefined) {
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
            this.parametroComunSeleccionado.valoresParametros.content.push(valorParam);
          }
        });

    } else {

      this.parametrosComunesService
        .updateValorParametro(this.parametroComunSeleccionado.consecutivo, valorParametroAGuardar, "MODIFICAR")
        .subscribe(valorParam => {
          if (valorParam !== null && valorParam !== undefined) {
            this.mostrarMensaje("Transacción exitosa.", "SUCCESS");
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

  seleccionarParametroComunEditar(valorParametroSeleccionado: ValorParametro) {
    this.valorParametroSeleccionado = valorParametroSeleccionado;
    if (this.valorParametroSeleccionado.parConsecutivo !== 0) {
      this.mostrarDetalleValoresParametroComun = true;
      this.crearNuevoValorParametro = false;
      this.formularioNuevoParametroComun.reset();

      if (this.valorParametroSeleccionado.estado != 'PPA' &&
        this.valorParametroSeleccionado.estado != 'IPA' &&
        this.valorParametroSeleccionado.estado != 'EPA') {
        this.flagEnableBotonAprobar = true;
        this.flagEnableBotonRechazar = true
      } else {
        this.flagEnableBotonAprobar = false;
        this.flagEnableBotonRechazar = false;
        if (this.parametroComunPendienteSeleccionado.tipoValidacion == tipoValidacionEnum.DI) {
          this.valorParametroSeleccionado.valor = "";
          this.valorParametroSeleccionado.fechaVigencia = "";
          this.valorParametroSeleccionado.valorMaximo = "";
          this.valorParametroSeleccionado.fechaFinVigencia = "";

        }
      }

      //Insertamos los valores en el formulario
      this.formularioNuevoValorParametro.get('valor')?.setValue(this.valorParametroSeleccionado.valor);
      this.formularioNuevoValorParametro.get('fechaVigencia')?.setValue(this.valorParametroSeleccionado.fechaVigencia);
      this.formularioNuevoValorParametro.get('fechaFinVigencia')?.setValue(this.valorParametroSeleccionado.fechaFinVigencia);
      this.formularioNuevoValorParametro.get('valorMaximo')?.setValue(this.valorParametroSeleccionado.valorMaximo);

    }
  }

  cargarValorParametro() {
    this.valorParametroAGuardar = {
      numero: this.valorParametroSeleccionado.numero,
      valor: (this.formularioNuevoValorParametro.get('valor')?.value).toUpperCase(),
      fechaVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaVigencia')?.value),
      valorMaximo: (this.formularioNuevoValorParametro.get('valorMaximo')?.value)?.toUpperCase(),
      fechaFinVigencia: this.dateUtilsService.formatDateToDD_MM_YYYY(this.formularioNuevoValorParametro.get('fechaFinVigencia')?.value),
    }

  }


  updateValorParametroPorEvento(evento: string) {

    this.cargarValorParametro();

    this.parametrosComunesService
      .updateValorParametro(this.parametroComunSeleccionado.consecutivo, this.valorParametroAGuardar, evento)
      .subscribe(valorParam => {
        if (valorParam !== null && valorParam !== undefined) {
          this.mostrarMensaje(valorParam.info, "SUCCESS");
          this.valorParametroSeleccionado.estado = valorParam.estado;
          this.valorParametroSeleccionado.fechaEstado = valorParam.fechaEstado;
        }
      });
  }


  perfilRequeridoAprobador(): boolean {

    return this.perfilesUsuario.indexOf(perfilesS3Enum.ADMINISTRADOR) != -1
      || this.perfilesUsuario.indexOf(perfilesS3Enum.APROBADOR) != -1;

  }

}

