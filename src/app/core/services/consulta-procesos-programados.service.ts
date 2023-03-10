import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { PeriodicidadEnum } from '../enums/periodicidad.enum';
import { ProcesosProgramadosResponse } from '../models/response/ProcesosProgramados.response';
import { SyNEnum } from '../enums/SyNEnum.enum';
import { ProcesoProgramadoRequest } from '../models/request/procesoProgramado.request';

/**
 * Un service encargado de manejar todas las peticiones relacionadas que realice
 * el componente de consulta de procesos programados.
 */

@Injectable({
  providedIn: 'root'
})
export class ConsultaProcesosProgramadosService {


  //  Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiProcesos + 'procesos/api/v1';


  constructor(private http: HttpClient) {
  }


  /**
   * GET request: obtiene todos los procesos programados.
   *
   * @param {number} page: numero de página.
   * @param {number} size: cantidad de elementos por página.
   * @param {string} sort: filtrado por.
   * @returns {Observable<ProcesosProgramadosResponse>}
   */

  public getProcesosProgramados(page: number, size: number, sort?: string): Observable<ProcesosProgramadosResponse> {

    // si el sort es undefined toma como valor: "".
    const sorting: string = (sort != undefined) ? sort : "";

    return this
      .http
      .get<ProcesosProgramadosResponse>(`${this.API_SERVER}/procesos-programacion`,
        {params: {"page": page, "size": size, "sort": sorting}});
  }


  /**
   * GET request: obtiene todos los procesos programados que coincidan con el objeto que se envía.
   *
   * @param  {ProcesoProgramadoRequest} request: corresponde a un objeto de un proceso programado
   * que será enviando en la petición.
   * @returns {Observable<ProcesosProgramadosResponse>}
   */

  busquedaPorFiltro(request: ProcesoProgramadoRequest): Observable<ProcesosProgramadosResponse> {
    return this.http.get<ProcesosProgramadosResponse>(`${this.API_SERVER}/procesos-programacion/busqueda-filtro`,
      {params: JSON.parse(JSON.stringify(request))});
  }


  /**
   * Se definen todos los items de busqueda y los retorna.
   * @returns {SelectItem[]}
   */

  getItemsBusqueda() {
    const itemsBusqueda: SelectItem[] = [
      {label: 'Proceso', value: 1},
      {label: 'Periodicidad', value: 2},
      {label: 'Fecha Inicio', value: 3},
      {label: 'Fecha Especifica', value: 4},
      {label: 'Solo días Hábiles', value: 5},
      {label: '¿Domingo?', value: 6},
      {label: '¿Lunes?', value: 7},
      {label: '¿Martes?', value: 8},
      {label: '¿Miercoles?', value: 9},
      {label: '¿Jueves?', value: 10},
      {label: '¿Viernes?', value: 11},
      {label: '¿Sabado?', value: 12},
      {label: 'Dia del mes', value: 13}
    ];

    return itemsBusqueda;
  }

  /**
   * Se definen todas la periodicdades a partir de las claves de los enums.
   * @returns {SelectItem[]}
   */
  getPeriodicidad() {
    const periodicidad = Object.keys(PeriodicidadEnum);
    const selectItemsPeriodicidad: SelectItem[] = [];

    selectItemsPeriodicidad.push({label: "  ", value: ""});

    Object.values(PeriodicidadEnum).forEach((element, index) => {
      selectItemsPeriodicidad.push({
        label: element,
        value: `${periodicidad[index]}`
      })
    });
    return selectItemsPeriodicidad;
  }

  /**
   * Se definen los items Si y No y su valor mediante el enumerado
   * existente.
   * @returns {SelectItem[]}
   */

  getSiNo() {
    const SiyNo = Object.keys(SyNEnum);
    const selectItemsSiYNo: SelectItem[] = [];

    selectItemsSiYNo.push({label: "  ", value: ""});

    Object.values(SyNEnum).forEach((element, index) => {
      selectItemsSiYNo.push({
        label: element,
        value: `${SiyNo[index]}`
      })
    });
    return selectItemsSiYNo;
  }


}
