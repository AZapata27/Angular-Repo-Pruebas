import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MensajeService } from 'app/core/services/mensaje.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ParametroEspecificoResponse } from '../model/response/parametros-especificos-response';
import { LazyLoadEvent } from 'primeng/api';
import { ParametrosEspecificoRequest } from '../model/request/parametros-especifico-request';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { ParametrosEspecificosService } from "../services/parametros-especificos.service";
import { ParametroEspecifico } from "../model/parametro-especifico";

@Component({
  selector: 'app-parametros-especificos',
  templateUrl: './parametros-especificos.component.html'
})
export class ParametrosEspecificosComponent implements OnInit {

  busquedaSimple: boolean = true;
  opcionesBusqueda: SelectItem[] = [];
  grupoOpciones: SelectItem [] = [];
  tipoValidacionOpciones: SelectItem[] = [];
  parametrosEspecificosResponse!: ParametroEspecificoResponse;
  parametroEspecificoSeleccionado!: ParametroEspecifico;
  mostrarDialogDetalles: boolean = false;
  campoBusqueda: number = 1;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  formularioParametrosEspecificos!: FormGroup;
  objetoABuscar!: ParametrosEspecificoRequest;
  @ViewChild('turboTable', {static: false}) turboTable!: Table;
  @ViewChild('paginador', {static: false}) paginador!: Paginator;
  currentPagePaginador: number = 0;
  offSetParametrosEspecificosGeneral: number = 0;


  constructor(
    private parametrosEspecificosService: ParametrosEspecificosService,
    private _formBuilder: FormBuilder,
    private mensajeService: MensajeService) {

    this.inicializarArraysYElementos();
    this.opcionesBusqueda = this.parametrosEspecificosService.getOpcionesBusqueda();
    this.grupoOpciones = this.parametrosEspecificosService.getGrupoOpciones();
    this.tipoValidacionOpciones = this.parametrosEspecificosService.getTipoValidacionOpciones();

  }

  ngOnInit(): void {
    this.createForm();
    this.createFormParametrosEspecificos();
  }

  cambiarCampoDeBusqueda() {
    this.campoBusqueda = Number.parseInt(this.formularioBusquedaSimple.get('selectedIndice')?.value);
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
    this.formularioBusquedaSimple.get("campoBuscar")?.setErrors(null);
  }

  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
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
          tipoValidacion: [""]

        }
      )
    }
    this.resetObjetoABuscar();
  }

  createFormParametrosEspecificos() {

    this.formularioParametrosEspecificos = this._formBuilder.group({
      grupo: [],
      tipoValidacion: []
    })
  }

  buscarPorFiltroSimple() {

    let txtABuscar: string = this.formularioBusquedaSimple.get('campoBuscar')?.value; // roles
    let opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value); // 3

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
    }


    this.objetoABuscar.size = 10;
    this.cargarData(10, 0);

  }

  buscarPorFiltroAvanzado() {

    this.resetObjetoABuscar();
    this.objetoABuscar = {
      codigo: new String(this.formularioBusquedaAvanzada.get('codigo')?.value).toUpperCase(),
      nombre: new String(this.formularioBusquedaAvanzada.get('nombre')?.value).toUpperCase(),
      descripcion: new String(this.formularioBusquedaAvanzada.get('descripcion')?.value).toUpperCase(),
      grupo: this.formularioBusquedaAvanzada.get('grupo')?.value,
      tipoValidacion: this.formularioBusquedaAvanzada.get('tipoValidacion')?.value,
      page: 0,
      size: 0
    }
    this.turboTable._totalRecords = 0;
    this.objetoABuscar.size = 10;
    this.cargarData(10, 0);

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

  cargarData(size: number, page: number) {

    if (this.objetoABuscar.size !== 0) {

      this.objetoABuscar.page = page;

      this.parametrosEspecificosService
        .getParametrosEspecificosBusqueda(this.objetoABuscar)
        .subscribe(response => {

          if (!(response.content.length === 0)) {
            this.parametrosEspecificosResponse = response;
            this.parametroEspecificoSeleccionado = response.content[0];
            this.offSetParametrosEspecificosGeneral = response.pageable.offset + 1;
          } else {
            this.mostrarMensaje("La consulta no encontró registros", "ERROR");
            this.inicializarArraysYElementos();
          }
        })
    } else {
      this.parametrosEspecificosService
        .getParametrosEspecificos(size, page)
        .subscribe(response => {
          this.parametrosEspecificosResponse = response;
          this.parametroEspecificoSeleccionado = response.content[0];
          this.offSetParametrosEspecificosGeneral = response.pageable.offset + 1;
        });

    }


  }

  inicializarArraysYElementos() {
    this.parametrosEspecificosResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    }

    this.objetoABuscar = {
      codigo: "",
      nombre: "",
      descripcion: "",
      tipoValidacion: "",
      grupo: "",
      page: 0,
      size: 0,
    }

    this.parametroEspecificoSeleccionado = {
      consecutivo: 0,
      tipo: "",
      codigo: "",
      nombre: "",
      descripcion: "",
      grupo: "",
      tipoValidacion: "",
    }

  }

  cambiarPageParametrosEspecificos(event: LazyLoadEvent) {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;
    this.cargarData(10, pageIndex);
  }


  cambiarPageParametroEspecificoSeleccionado(event: LazyLoadEvent) {

    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;

    if (this.currentPagePaginador !== pageIndex) {
      this.currentPagePaginador = pageIndex;
      this.parametrosEspecificosService
        .getParametrosEspecificos(1, pageIndex).subscribe(res => {
        this.parametroEspecificoSeleccionado = res.content[0];
        this.setValuesFormulario();

        /*      if(pageIndex > 10){
                this.parametrosEspecificosResponse.content.shift();
                this.parametrosEspecificosResponse.content.push(this.parametroEspecificoSeleccionado);
              }*/

      });
    }


  }


  deSeleccionarFila() {
    this.parametroEspecificoSeleccionado = {
      consecutivo: 0,
      tipo: "",
      codigo: "",
      nombre: "",
      descripcion: "",
      grupo: "",
      tipoValidacion: "",
    }
  }

  resetObjetoABuscar() {

    this.objetoABuscar = {
      codigo: "",
      nombre: "",
      descripcion: "",
      tipoValidacion: "",
      grupo: "",
      page: 0,
      size: 0,
    }
  }

  mostrarDialogDetallesParamatero() {
    if (this.parametroEspecificoSeleccionado.consecutivo !== 0) {
      this.mostrarDialogDetalles = true;

      //TODO
      this.setValuesFormulario();

      this.currentPagePaginador = this.parametrosEspecificosResponse.content.indexOf(this.parametroEspecificoSeleccionado);
      this.paginador.changePage(this.currentPagePaginador);

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

  grabarParametroEspecificoEditado() {

    if (this.formularioParametrosEspecificos.get('grupo')?.value === this.getGrupo(this.parametroEspecificoSeleccionado.grupo)
      && this.formularioParametrosEspecificos.get('tipoValidacion')?.value === this.getTipoValidacion(this.parametroEspecificoSeleccionado.tipoValidacion)) {

      this.mostrarMensaje("No existen cambios a grabar", "ERROR");
      return;
    }

    let mensajeAMostrar = "Fallos de validación de pantalla: <br> ";
    let muestraMensaje = false;

    if (this.formularioParametrosEspecificos.get('grupo')?.value === '') {
      mensajeAMostrar = mensajeAMostrar + "Grupo - Se debe seleccionar un valor.";
      muestraMensaje = true;
    }

    if (this.formularioParametrosEspecificos.get('tipoValidacion')?.value === '') {
      mensajeAMostrar = mensajeAMostrar + "Tipo Validación - Se debe seleccionar un valor.";
      muestraMensaje = true;
    }

    if (muestraMensaje) {
      this.mostrarMensaje(mensajeAMostrar, "ERROR");
      return;
    }


    this.parametroEspecificoSeleccionado.grupo = this.formularioParametrosEspecificos.get('grupo')?.value;
    this.parametroEspecificoSeleccionado.tipoValidacion = this.formularioParametrosEspecificos.get('tipoValidacion')?.value


    this.parametrosEspecificosService
      .updateParametroEspecifico(this.parametroEspecificoSeleccionado)
      .subscribe(res => {

        this.parametroEspecificoSeleccionado = res;
        this.mostrarMensaje("Transacción Exitosa", "SUCCESS");
        this.parametrosEspecificosResponse
          .content
          .forEach((value, index) => {
            if (value.consecutivo === res.consecutivo) this.parametrosEspecificosResponse.content[index] = res;
            return;
          });


      });


  }


  getGrupo(type: string): string | undefined {
    return {
      'De garantia': 'GAR',
      'De negocio': 'NEG',
      'De credito': 'CRE',
      'Financiero': 'FIN',
      'De sistema': 'SIS',
      'Administrativo': 'ADM',
      'Juridico': 'JUR'
    }[type];
  }

  getTipoValidacion(type: string): string | undefined {
    return {
      'Aprobacion': 'A',
      'Doble Intervencion': 'DI'
    }[type];
  }

  setValuesFormulario() {
    const grupoIndex = this.grupoOpciones
      .filter(p => {
        return p.label === this.parametroEspecificoSeleccionado.grupo.toString();
      }).map(paramEspecifico => paramEspecifico.value)[0];

    const tipoValidacionIndex = this.tipoValidacionOpciones
      .filter(p => {
        return p.label === this.parametroEspecificoSeleccionado.tipoValidacion.toString();
      }).map(paramEspecifico => paramEspecifico.value)[0];

    this.formularioParametrosEspecificos.controls['grupo'].setValue(grupoIndex, {onlySelf: true});
    this.formularioParametrosEspecificos.controls['tipoValidacion'].setValue(tipoValidacionIndex, {onlySelf: true});
  }


}

