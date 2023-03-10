import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreditosVigentesResponse } from 'app/core/models/response/CreditosVigentes.response';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreditosEspecificosService } from '../../../core/services/creditos-especificos.service';
import { CreditoVigente } from '../../../core/models/creditoVigente.interface';
import { CreditosVigentesRequest } from 'app/core/models/request/creditosVigentes.request';
import { MensajeService } from 'app/core/services/mensaje.service';

@Component({
  selector: 'creditos-epecificos',
  templateUrl: './creditos-epecificos.component.html'
})
export class CreditosEpecificosComponent implements OnInit {

  creditosEspecificosArray: any[] = [];
  busquedaSimple: boolean = true;
  opciones: SelectItem[] = [];
  tipoIdentificacion: SelectItem[] = [];
  lineasCredito: SelectItem[] = [];
  campoBusqueda: number = 1;
  @ViewChild('turboTable', {static: false}) turboTable: any;
  formularioBusquedaSimple!: FormGroup;
  formularioBusquedaAvanzada!: FormGroup;
  creditosVigentes!: CreditosVigentesResponse;
  objetoABuscar!: CreditosVigentesRequest;
  creditoSeleccionado!: CreditoVigente;


  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private creditosEspecificosService: CreditosEspecificosService,
              private _formBuilder: FormBuilder,
              private mensajeService: MensajeService) {

    this.inicializarArraysYElementos();

    this.cargarData(0, 15);

    this.opciones = creditosEspecificosService.cargarOpcionesBuqueda();
    this.tipoIdentificacion = creditosEspecificosService.cargarOpcionesTipoIdentifiacion();
    this.creditosEspecificosService
      .getLineasCredito()
      .subscribe(lineasCreditoData => this.lineasCredito = lineasCreditoData);

    this.createForm();
  }


  ngOnInit(): void {

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
          numeroCredito: [""],
          tipoIdentificacion: [""],
          identificacionTitular: [""],
          nombreTitular: [""],
          apellidosTitular: [""],
          lineaCredito: [""],
          monto: [""]
        }
      )

    }
// this.resetObjetoABuscar();

  }


  cambiarBusqueda(opcion: boolean) {
    this.busquedaSimple = opcion;
    this.createForm();
  }


  cambiarCampoDeBusqueda() {
    const opcion = Number(this.formularioBusquedaSimple.get('selectedIndice')?.value);

    this.campoBusqueda = opcion;
    this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
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
        this.objetoABuscar.numeroCredito = txtABuscar;
        break;
      case 2:
        this.objetoABuscar.tipoIdentificacion = txtABuscar;
        break;
      case 3:
        this.objetoABuscar.identificacionTitular = txtABuscar;
        break;
      case 4:
        this.objetoABuscar.nombreTitular = txtABuscar.toUpperCase();
        break;
      case 5:
        this.objetoABuscar.apellidosTitular = txtABuscar.toUpperCase();
        break;
      case 6:
        this.objetoABuscar.lineasCreditoConsecutivo = txtABuscar;
        break;
      case 7:
        this.objetoABuscar.monto = txtABuscar;
        break;

    }

    this.turboTable._first = 0;
    this.objetoABuscar.size = 15;
    this.cargarData(0, 15);
  }

  buscarPorFiltroAvanzado() {
    if (!this.validacionCamposFormularios()) {
      return;
    }

    this.objetoABuscar = {
      numeroCredito: this.formularioBusquedaAvanzada.get('numeroCredito')?.value,
      lineasCreditoConsecutivo: this.formularioBusquedaAvanzada.get('lineaCredito')?.value,
      tipoIdentificacion: this.formularioBusquedaAvanzada.get('tipoIdentificacion')?.value,
      identificacionTitular: this.formularioBusquedaAvanzada.get('identificacionTitular')?.value,
      nombreTitular: this.formularioBusquedaAvanzada.get('nombreTitular')?.value.toUpperCase(),
      apellidosTitular: this.formularioBusquedaAvanzada.get('apellidosTitular')?.value.toUpperCase(),
      monto: this.formularioBusquedaAvanzada.get('monto')?.value,
      page: 0,
      size: 0
    }


    this.objetoABuscar.size = 15;
    this.cargarData(0, 15);
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

  inicializarArraysYElementos() {

    this.creditosVigentes = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0
    }

    this.creditoSeleccionado = {
      consecutivo: 0,
      numeroCredito: 0,
      lineaCredito: "",
      monto: 0,
      tipoIdentificacionTitular: "",
      identificacionTitular: 0,
      nombreTitular: "",
      apellidosTitular: "",
      estado: ""
    }

    this.resetObjetoABuscar();

  }

  deSeleccionarFila() {
    this.creditoSeleccionado = {
      consecutivo: 0,
      numeroCredito: 0,
      lineaCredito: "",
      monto: 0,
      tipoIdentificacionTitular: "",
      identificacionTitular: 0,
      nombreTitular: "",
      apellidosTitular: "",
      estado: ""
    }
  }

  cerrarDialog() {
    this.ref.close();
  }

  enviarCreditoSelecionado() {
    if (this.creditoSeleccionado.consecutivo !== 0) {
      this.creditosEspecificosService.setCreditoSeleccionado(this.creditoSeleccionado);
      this.ref.close();
      this.deSeleccionarFila();
    }

  }


  validacionCamposFormularios(): boolean {
    if (this.busquedaSimple) {

      if ((this.campoBusqueda === 1 || this.campoBusqueda === 3 || this.campoBusqueda === 7)
        && (isNaN(this.formularioBusquedaSimple.get('campoBuscar')?.value)
          || new RegExp(/^[0-9]*$/).test(this.formularioBusquedaSimple.get('campoBuscar')?.value) === false)) {

        // console.log("resultado de regex: " + new RegExp(/^[0-9]*$/).test(this.formularioBusquedaSimple.get('campoBuscar')?.value));
        // console.log("el numero es: " + this.formularioBusquedaSimple.get('campoBuscar')?.value);
        this.formularioBusquedaSimple.get('campoBuscar')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");

        return false;
      }

    } else {

      if (isNaN(this.formularioBusquedaAvanzada.get('numeroCredito')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('numeroCredito')?.value) === false) {
        this.formularioBusquedaAvanzada.get('numeroCredito')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");
        return false;
      } else if (isNaN(this.formularioBusquedaAvanzada.get('identificacionTitular')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('identificacionTitular')?.value) === false) {

        this.formularioBusquedaAvanzada.get('identificacionTitular')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");

        return false;
      } else if (isNaN(this.formularioBusquedaAvanzada.get('monto')?.value) ||
        new RegExp(/^[0-9]*$/).test(this.formularioBusquedaAvanzada.get('monto')?.value) === false) {

        this.formularioBusquedaAvanzada.get('monto')?.setValue("");
        this.mostrarMensaje("Se ha digitado caracteres alfabéticos como criterio de búsqueda de un campo numérico");

        return false;
      }

    }
    return true;
  }


  cargarData(page: number, size: number): void {

    if (this.objetoABuscar.size != 0) {
      this.objetoABuscar.page = page;
      this.objetoABuscar.size = size;

      this.creditosVigentes.content = [];

      this.creditosEspecificosService
        .busquedaPorFiltro(this.objetoABuscar)
        .subscribe(data => {
          if (data != null) {
            this.creditosVigentes = data;
          } else {
            this.mostrarMensaje("La busqueda no arrojó ningun resultado")
            this.inicializarArraysYElementos();
          }
        });
    } else {

      this.creditosVigentes.content = [];
      this.creditosEspecificosService
        .getCreditosVigentes(page, size)
        .subscribe(data => {
          this.creditosVigentes = data;
        });
    }
  }


  cambiarPage(event: LazyLoadEvent): void {
    // @ts-ignore: Object is possibly 'null'.
    let pageIndex = event.first / event.rows;
    this.cargarData(pageIndex, 15);
  }


  resetObjetoABuscar() {
    this.objetoABuscar = {
      numeroCredito: "",
      lineasCreditoConsecutivo: "",
      tipoIdentificacion: "",
      identificacionTitular: "",
      nombreTitular: "",
      apellidosTitular: "",
      monto: "",
      page: 0,
      size: 0
    }
  }

  mostrarMensaje(mensaje: string) {
    this.mensajeService.mostrarMensajeError({
      showMessage: true,
      detalles: mensaje,
      icon: "pi pi-times-circle"
    });
  }

}
