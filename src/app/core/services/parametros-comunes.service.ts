import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { grupoParametroEnum } from '../enums/grupoParametro.enum';
import { tipoValidacionEnum } from '../enums/tipoValidacion.enum';
import { SelectItem } from 'primeng/api/selectitem';
import { Observable } from 'rxjs/internal/Observable';
import { ParametroComunRequest } from '../models/request/parametroComun.request';
import { SyNEnum } from '../enums/SyNEnum.enum';
import { tipoDatoEnum } from '../enums/tipoDatoParametro.enum';
import { UnidadMedidaEnum } from '../enums/unidadMedida.enum';

@Injectable({
  providedIn: 'root'
})
export class ParametrosComunesService {

  // Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiAdministracion + 'administracion/api/v1';

  // constructor
  constructor(private http: HttpClient) {

  }


  getOpcionesBusqueda() {
    const opciones: SelectItem[] = [
      {label: 'Código', value: 1},
      {label: 'Nombre', value: 2},
      {label: 'Descripción', value: 3},
      {label: 'Grupo', value: 4},
      {label: 'Tipo Validación', value: 5},
      {label: '¿Multivaluado?', value: 6},
      {label: 'Tipo Dato', value: 7},
      {label: 'Longitud', value: 8},
      {label: 'Unidad', value: 9},
      {label: 'Precisión', value: 10}
    ];

    return opciones;
  }

  getGrupoOpciones() {
    const keysGrupoParametro = Object.keys(grupoParametroEnum);
    const estados: SelectItem[] = [];

    estados.push({label: "", value: ""});

    Object.values(grupoParametroEnum).forEach((element, index) => {
      estados.push({
        label: element,
        value: `${keysGrupoParametro[index]}`
      })
    });

    return estados;
  }


  getTipoValidacionOpciones() {
    const keysTipoValidacionEnum = Object.keys(tipoValidacionEnum);
    const estados: SelectItem[] = [];

    estados.push({label: "", value: ""});

    Object.values(tipoValidacionEnum).forEach((element, index) => {
      estados.push({
        label: element,
        value: `${keysTipoValidacionEnum[index]}`
      })
    });

    return estados;
  }

  getMultiValuadoOpciones() {
    const keysMultiValuado = Object.keys(SyNEnum);
    const itemsMultivaluado: SelectItem[] = [];

    itemsMultivaluado.push({label: "  ", value: ""});

    Object.values(SyNEnum).forEach((element, index) => {
      itemsMultivaluado.push({
        label: element,
        value: `${keysMultiValuado[index]}`
      })
    });
    return itemsMultivaluado;
  }

  getTipoDatoOpciones() {
    const tipoDatoOpciones = Object.keys(tipoDatoEnum);
    const selectItemstipoDatoOpciones: SelectItem[] = [];

    selectItemstipoDatoOpciones.push({label: "  ", value: ""});
    Object.values(tipoDatoEnum).forEach((element, index) => {
      selectItemstipoDatoOpciones.push({
        label: element,
        value: `${tipoDatoOpciones[index]}`
      })
    });
    return selectItemstipoDatoOpciones;
  }


  getUnidadMedidaOpciones() {
    const unidadMedidaOpciones = Object.keys(UnidadMedidaEnum);
    const selectItemsUnidadMedidaOpciones: SelectItem[] = [];

    selectItemsUnidadMedidaOpciones.push({label: "  ", value: ""});

    Object.values(UnidadMedidaEnum).forEach((element, index) => {
      selectItemsUnidadMedidaOpciones.push({
        label: element,
        value: `${unidadMedidaOpciones[index]}`
      })
    });
    return selectItemsUnidadMedidaOpciones;
  }


  getParametrosComunes(size: number, page: number): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-comunes`,
      {
        params: {
          "size": size,
          "page": page
        }
      })
  }

  getParametrosComunesPendientes(size: number, page: number): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-comunes/pendientes`,
      {
        params: {
          "size": size,
          "page": page
        }
      })
  }

  getValoresParametrosDeParametroComun(consecutivo: number, page: number): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-comunes/${consecutivo}/valores-parametro`,
      {
        params: {
          "size": 10,
          "page": page
        }
      })
  }


  getParametrosComunBusqueda(request: ParametroComunRequest): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-comunes/busqueda-filtro`,
      {params: JSON.parse(JSON.stringify(request))})
  }


  crearParametroComun(parametroComunAGuardar: any): Observable<any> {
    return this.http.post(`${this.API_SERVER}/parametros-comunes`, parametroComunAGuardar);
  }

  crearValorParametro(consecutivo: number, valorParametroAGuardar: any): Observable<any> {
    return this.http
      .post(`${this.API_SERVER}/parametros-comunes/${consecutivo}/valores-parametro`, valorParametroAGuardar);
  }

  updateParametroComun(parConsecutivo: number, parametroComunAModificar: any): Observable<any> {

    return this.http.patch<any>(`${this.API_SERVER}/parametros-comunes/${parConsecutivo}`, parametroComunAModificar);

  }

  updateValorParametro(parConsecutivo: number, valorParametro: any, evento: string) {
    return this.http.patch<any>(`${this.API_SERVER}/parametros-comunes/${parConsecutivo}/valores-parametro/${evento}`, valorParametro);
  };


}
