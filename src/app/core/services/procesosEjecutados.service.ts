import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubProceso } from '../models/subproceso.interface';
import { Informativa } from '../models/informativa.interface';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ProcesosXEjecucionResponse } from '../models/response/ProcesosXEjecucion.response';
import { ProcesosXEjecucionRequest } from '../models/request/procesoXEjecucion.request';


@Injectable({
  providedIn: 'root'
})
export class ProcesosEjecutadosServices {

  // Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiProcesos + 'procesos/api/v1/';


  // constructor
  constructor(private http: HttpClient) {
  }


  getProcesos(page: number, size: number, sort?: string): Observable<ProcesosXEjecucionResponse> {
    // console.log(`api server -> ${this.API_SERVER}`);
    const sorting: string = (sort != undefined) ? sort : "";
    return this.http.get<ProcesosXEjecucionResponse>(`${this.API_SERVER}procesos-x-ejecucion`,
      {params: {"page": page, "size": size, "sort": sorting}});
  }


  getSubProcesos(consecutivo: number): Observable<SubProceso[]> {
    return this.http.get<SubProceso[]>(`${this.API_SERVER}procesos/${consecutivo}/subprocesos`);
  }


  getErrores(consecutivo: number): Observable<Informativa[]> {
    return this.http.get<Informativa[]>(`${this.API_SERVER}procesos-x-ejecucion/${consecutivo}/errores`);
  }


  getLogs(consecutivo: number): Observable<Informativa[]> {
    return this.http.get<Informativa[]>(`${this.API_SERVER}procesos-x-ejecucion/${consecutivo}/logs`);
  }

  busquedaPorFiltro(request: ProcesosXEjecucionRequest): Observable<ProcesosXEjecucionResponse> {
    return this.http.get<ProcesosXEjecucionResponse>(`${this.API_SERVER}procesos-x-ejecucion/busqueda-filtro`,
      {params: JSON.parse(JSON.stringify(request))});
  }


}
