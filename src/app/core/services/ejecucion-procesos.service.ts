import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SelectItem } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { EstadoProcesosEnum } from '../enums/estadoProcesos.enum';
import { ProcesoEjecutadoRequest } from '../models/request/procesoEjecutadoRequest';
import { ProcesosEjecutadosResponse } from '../models/response/ProcesosEjecutados.response';
import { procesoEjecutadoGuardarRequest } from '../models/request/procesoEjecutadoGuardar.request';

/**
 * Service encargado de la ejecucion de procesos y todo lo relacionado con ello.
 * Es utilizado por el componente ejecución de procesos para la solicitud y
 * petición de información.
 */
@Injectable({
  providedIn: 'root'
})
export class EjecucionProcesosService {


  // Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiProcesos + 'procesos/api/v1';


  // constructor
  constructor(private http: HttpClient) {
  }

  /**
   * GET request: obtiene los procesos ejecutados.
   * @param {number} size: cantidad de elementos por pagina.
   * @param {number} page: número a paginar.
   * @returns {Observable<ProcesosEjecutadosResponse>}
   */
  public getProcesosEjecutados(size: number, page: number): Observable<ProcesosEjecutadosResponse> {

    return this
      .http
      .get<ProcesosEjecutadosResponse>(`${this.API_SERVER}/procesos-ejecutados`, {
        params: {
          "size": size,
          "page": page
        }
      });
  }


  /**
   * GET request: obtiene los créditos del proceso
   * @param  {string} consecutivoProceso: consecutivo de la ejecución del proceso.
   * @returns {Observable<any>}
   */
  public getCreditosDelProceso(consecutivoProceso: string): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditos`);
  }

  /**
   * GET request: obtiene los procesos incluidos del proceso ejecutado.
   * @param {string} consecutivoProceso: consecutivo del proceso.
   * @returns {Observable<any>}
   */
  public getProcesosIncluidos(consecutivoProceso: string): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/procesos-x-ejecucion`);
  }


  /**
   * GET request: obtiene los creditos excluidos del proceso ejecutado.
   * @param consecutivoProceso: consecutivo del proceso.
   * @param page: número a paginar.
   * @returns {Observable<any>}
   */
  public getCreditosExcluidosXProcesoEjecutado(consecutivoProceso: number, page: number): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditos-excluir`, {
        params: {
          "page": page,
          "size": 10
        }
      });
  }

  /**
   * GET request: obtiene los creditos seleccionados del proceso según la
   * el número de pagina.
   * @param {number} consecutivoProceso: consecutivo del proceso.
   * @param {number} page: numero a paginar.
   * @returns
   */
  public getCreditosSeleccionadosDelProceso(consecutivoProceso: number, page: number): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditos`, {
        params: {
          "page": page,
          "size": 10
        }
      });
  }


  /**
   * GET request: obtiene las sucursales Banrep.
   * @returns {Observable<any>}
   */
  public getSucursales(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/sucursales`)
      .pipe(map<any[], SelectItem[]>(res => {


        const data = res.map(sucursal => ({
          label: sucursal.ciudadNombre,
          value: sucursal.codigoRegional
        }));

        data.unshift({label: "", value: 0});

        return data;
      }));
  }

  /**
   * GET request: obtiene los tipos de liquidación.
   * @returns {Observable<any>}
   */

  public getTipoLiquidacion(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/tipoLiquidacion`)
      .pipe(map<any[], SelectItem[]>(res => {

        const data = res.map(tipoLiquidacion => ({
          label: tipoLiquidacion.tipoNombre,
          value: tipoLiquidacion.tipoCodigo
        }));

        data.unshift({label: "", value: 0});

        return data;
      }));
  }


  /**
   * GET request: obtiene los centros de costo Banrep.
   * @returns {Observable<any>}
   */
  public getCentroCosto(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/centroCosto`)
      .pipe(map<any[], SelectItem[]>(res => {

        const data = res.filter(p => p !== null).map(centroCosto => (
          {
            label: centroCosto.nombre,
            value: centroCosto.codigo
          }));


        data.unshift({label: "", value: 0});

        return data;
      }));
  }

  /**
   * GET request: obtiene los tipos de nómina Banrep.
   * @returns {Observable<any>}
   */
  public getTipoNomina(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/tipoNomina`)
      .pipe(map<any[], SelectItem[]>(res => {

        const data = res.map(tipoNomina => ({
          label: tipoNomina.nombre,
          value: tipoNomina.consecutivo
        }));

        data.unshift({label: "", value: 0});

        return data;
      }));
  }

  /**
   * GET request: obtiene las líneas de crédito Banrep.
   * @returns {Observable<any>}
   */
  public getLineasCredito(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/lineasCredito`)
      .pipe(map<any[], SelectItem[]>(res => {

        const data = res.map(linea => ({
          label: linea.nombre,
          value: linea.codigo
        }));

        data.unshift({label: "", value: 0});

        return data;
      }));
  }

  /**
   * carga los estados del crédito según el enumerado procesos.
   * @returns {SelectItem[] }
   */
  getEstadoCredito() {
    const keysEstadoCredito = Object.keys(EstadoProcesosEnum);
    const estados: SelectItem[] = [];

    estados.push({label: "", value: ""});

    Object.values(EstadoProcesosEnum).forEach((element, index) => {
      estados.push({
        label: element,
        value: `${keysEstadoCredito[index]}`
      })
    });

    return estados;
  }

  /**
   * carga las opciones de buqueda.
   * @returns {SelectItem[] }
   */
  getOpcionesBusqueda() {
    const opciones: SelectItem[] = [
      {label: 'Número de proceso', value: 1},
      {label: 'Criterio de Cobertura', value: 2},
      {label: 'Fecha Ejecución', value: 3},
      {label: 'Estado', value: 4},
      {label: 'Linea de crédito', value: 5},
      {label: 'Tipo Liquidacion', value: 6},
      {label: 'Tipo Nómina ', value: 7},
      {label: 'Centro de Costo', value: 8}
    ];

    return opciones;
  }


  /**
   * GET request: obtiene los procesos ejecutados que coincidan con el objeto
   * que se envía.
   * @param { ProcesoEjecutadoRequest } request: corresponde al objeto que se mandará en
   * la request.
   * @returns {Observable<ProcesosEjecutadosResponse>}
   */
  busquedaPorFiltro(request: ProcesoEjecutadoRequest): Observable<ProcesosEjecutadosResponse> {
    return this.http.get<ProcesosEjecutadosResponse>(`${this.API_SERVER}/procesos-ejecutados/busqueda-filtro`,
      {params: JSON.parse(JSON.stringify(request))});
  }


  /**
   * POST request: permite guardar una nueva ejecución de procesos.
   * @param {procesoEjecutadoGuardarRequest} NuevaEjecucionAGuardar: objeto que se manda en
   * la request.
   * @returns { Observable<any>}
   */
  guardarNuevaEjecucionProceso(NuevaEjecucionAGuardar: procesoEjecutadoGuardarRequest): Observable<any> {
    return this.http
      .post(`${this.API_SERVER}/procesos-ejecutados`, NuevaEjecucionAGuardar);
  }

  /**
   * DELETE request: permite eliminar una ejecución de procesos.
   * @param consecutivo: consecutivo del proceso.
   * @returns {Observable<any>}
   */
  eliminarEjecucionProceso(consecutivo: number): Observable<any> {
    return this.http.delete(`${this.API_SERVER}/procesos-ejecutados/${consecutivo}`);
  }

  /**
   * EJECUTAR request: permite eliminar una ejecución de procesos.
   * @param consecutivo: consecutivo del proceso.
   * @returns {Observable<any>}
   */
  ejecutarEjecucionProceso(consecutivo: number): Observable<any> {
    return this.http.get(`${this.API_SERVER}/procesos-ejecutados/${consecutivo}/ejecutar`);
  }

  /**
   * Permite obtener el fecha de ejecución.
   * @returns {Observable<string>}
   */
  obtenerFechaEjecucion(): Observable<string> {
    return this.http.get(`${this.API_SERVER}/procesos-ejecutados/fecha-ejecucion`, {
      responseType: 'text'
    });
  }

  /**
   * PATCH request: permite modificar un crédito existente.
   * @param {number} consecutivoProceso: corresponde al consecutivo del proceso.
   * @param {number} consecutivoCredito: corresponde al consecutivo del crédito.
   * @param {number} excluir: indica si se va a excluir (true) o No (false)
   * @returns {Observable<any>}
   */
  excluirCredito(consecutivoProceso: number, consecutivoCredito: number, excluir: boolean): Observable<any> {
    return this
      .http
      .patch<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditos-excluir/${consecutivoCredito}?excluir=${excluir}`, {});
  }


  /**
   * PATCH request: permite agregar un crédito seleccionado a la ejecución del proceso.
   * @param {number} consecutivoProceso: corresponde al consecutivo del proceso.
   * @param {number []} numeros: corresponde a los números de crédito que serán agregados.
   * @returns {Observable<any>}
   */
  AgregarCreditoSeleccionado(consecutivoProceso: number, numeros: number[]): Observable<any> {
    return this
      .http
      .patch<any>(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditos`, numeros);
  }


  /**
   * DELETE request: permite eliminar un crédito del proceso.
   *
   * @param {number} consecutivoProceso: corresponde al consecutivo del proceso.
   * @param {number} consecutivoCredito: corresponde al consecutivo del crédito.
   * @returns {Observable<any> }
   */
  eliminarCreditoPorProceso(consecutivoProceso: number, consecutivoCredito: number): Observable<any> {
    return this.http.delete(`${this.API_SERVER}/procesos-ejecutados/${consecutivoProceso}/creditosXProceso/${consecutivoCredito}`);
  }


  /**
   * GET request: permite obtener el estado del último proceso creado.
   * por ello se realiza content[0].
   * @returns {Observable<string> }
   */
  public getEstadoUltimoProcesoEjecutado(): Observable<string> {

    return this
      .http
      .get<ProcesosEjecutadosResponse>(`${this.API_SERVER}/procesos-ejecutados`, {params: {"size": 1, "page": 0}})
      .pipe(map<ProcesosEjecutadosResponse, string>(p => p.content[0].estado))
  }


}
