import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SelectItem } from 'primeng/api/selectitem';
import { grupoParametroEnum } from '../enums/grupoParametro.enum';
import { tipoValidacionEnum } from '../enums/tipoValidacion.enum';
import { Observable } from 'rxjs';
import { ParametroEspecificoRequest } from '../models/request/parametroEspecifico.request';
import { ParametroEspecifico } from '../models/parametroEspecifico.interface';

@Injectable({
  providedIn: 'root'
})
export class ParametrosEspecificosService {


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
      {label: 'Tipo Validación', value: 5}
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


  getParametrosEspecificos(size: number, page: number): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-especificos`,
      {
        params: {
          "size": size,
          "page": page
        }
      })
  }

  getParametrosEspecificosBusqueda(request: ParametroEspecificoRequest): Observable<any> {
    return this.http.get(`${this.API_SERVER}/parametros-especificos/busqueda-filtro`,
      {params: JSON.parse(JSON.stringify(request))})
  }

  updateParametroEspecifico(parametroEspecificoAModificar: any): Observable<ParametroEspecifico> {

    return this.http.patch<ParametroEspecifico>(`${this.API_SERVER}/parametros-especificos`, parametroEspecificoAModificar);

  }


}
