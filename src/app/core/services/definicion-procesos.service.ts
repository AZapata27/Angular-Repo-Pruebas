import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SelectItem } from 'primeng/api';
import { map, Observable, tap } from 'rxjs';
import { PeriodicidadEnum } from '../enums/periodicidad.enum';
import { SyNEnum } from '../enums/SyNEnum.enum';
import { ProcesoPadreRequest } from '../models/request/ProcesoPadre.request';
import { procesoProgramadoRequestGuardar } from '../models/request/procesoProgramado.request';

/**
 * Service encargado de manejar todas las peticiones y solicitudes del componente
 * definición de procesos.
 */

@Injectable({
  providedIn: 'root'
})
export class DefinicionProcesosService {

  // Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiProcesos + 'procesos/api/v1';

  // El api para los procesos no tiene paginación y además por el filtro que se hace
  // se debe manejar un numero total de procesos.
  public totalProcesos: number = 0;


  // constructor
  constructor(private http: HttpClient) {
  }


  /**
   * GET request: obtiene los procesos y filtra todos aquellos que no sean subprocesos
   * , es decir, sean procesos padres.
   * @param {number} position: posición del array procesos que retorna la petición.
   * @returns {Observable<any>}
   */

  public getProcesos(position: number): Observable<any> {

    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos`).pipe(
        map((data) => {
          this.totalProcesos = data.filter((item: any) => item.procesoPadreConsecutivo === null).length;
          return data.filter((item: any) => item.procesoPadreConsecutivo === null)[position];
        })
      );
  }

  /**
   * GET request: obtiene todos los subprocesos de un proceso padre por el consecutivo.
   * @param {number} consecutivo: consecutivo del proceso padre.
   * @returns {Observable<any>}
   */

  public getSubprocesos(consecutivo: number): Observable<any> {

    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos/${consecutivo}/subprocesos`).pipe();
  }


  /**
   * Obtiene todos los procesos programados para un proceso padre por el consecutivo.
   * @param consecutivo: consecutivo de proceso padre.
   * @returns {Observable<any>}
   */
  public getProcesosProgramados(consecutivo: number): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos-programacion`)
      .pipe(tap(),
        map(p => {
          const procesosFiltrados = p.content.filter((val: any) => val.procesosConsecutivo === consecutivo)
          return procesosFiltrados;
        }))

  }


  /**
   * GET request: obtiene todos los procesos que coincidan con el objeto request.
   * Tambien hace una tranformación de data con un filtro el cual verifica si
   * los procesos resultantes sean procesos padres.
   * @param {any} request
   * @param {number} page
   * @returns {Observable<any>}
   */
  busquedaPorFiltro(request: any, page: number): Observable<any> {
    return this.http
      .get<any>(`${this.API_SERVER}/procesos/busqueda-filtro`,
        {params: JSON.parse(JSON.stringify(request))})
      .pipe(map((data) => {

        if (data !== null) {
          const procesosFiltrados: any [] = data.filter((item: any) => item.procesoPadreConsecutivo === null);
          this.totalProcesos = procesosFiltrados.length;
          return procesosFiltrados[page];
        }


      }))
  }


  /**
   * POST request: permite guardar una nueva programación de proceso.
   * @param {procesoProgramadoRequestGuardar} nuevaProgramacionProcesos: proceso programado
   * a guardar.
   * @returns {Observable<any>}
   */
  guardarNuevaProgramacionProceso(nuevaProgramacionProcesos: procesoProgramadoRequestGuardar): Observable<any> {
    return this.http
      .post(`${this.API_SERVER}/procesos-programacion`, nuevaProgramacionProcesos);
  }

  /**
   * PATCH request: permite actualizar un proceso.
   *
   * @param {ProcesoPadreRequest} procesoAEditar
   * @returns {Observable<any>}
   */

  public updateProceso(procesoAEditar: ProcesoPadreRequest): Observable<any> {

    return this
      .http
      .patch<any>(`${this.API_SERVER}/procesos`, procesoAEditar);
  }


  /**
   * Carga los items de busqueda.
   * @returns {SelectItem[]}
   */

  getOpcionesBusqueda() {
    const opciones: SelectItem[] = [
      {label: 'Nombre Proceso', value: 1},
      {label: 'Descripción', value: 2},
      {label: 'Ejecución por periodicidad', value: 3},
      {label: 'Fecha Inicio', value: 4},
      {label: '¿Ejecución por fecha especifica?', value: 5},
      {label: '¿Activo?', value: 6}
    ];

    return opciones;
  }

  /**
   * Carga los items Si y No mediante el enumerado.
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


  /**
   * Carga los items de periodicidad mediante el enumerado.
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


}
