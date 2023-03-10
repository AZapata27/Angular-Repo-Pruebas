// imports
import { ProcesosProgramados } from './ProcesosProgramados.response';
import { Procesos } from '../Procesos.interface';

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * un array de parametros comunes y sus respectivas propiedades para paginar.
 *
 * @interface  ProcesosDefinicionResponse
 * @member {ProcesosDefinidos []} content: array de procesos definidos.
 * @member {number} totalElements: cantitad total general de procesos definidos.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ProcesosDefinicionResponse {

  procesosDefinidos: ProcesosDefinidos,
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


/**
 * interface que será enviada en las peticiones, corresponde a los procesos
 * definidos, es utiliza en el componente de definición de procesos.
 *
 * @interface ProcesosDefinidos
 * @member {number} consecutivo: consecutivo del proceso definido.
 * @member {string} nombre: nombre del proceso definido.
 * @member {string} descripcion: descripcion del proceso definido.
 * @member {string} periodicidadEjecucion: periodicidad en la ejecución del proceso.
 * @member {string} fechaInicio: fecha inicio del proceso.
 * @member {string} permitirEjecucionExtemp: ejecución por fecha
 * @member {string} activo: si se encuentra activo.
 * @member {string} pantalla: pantalla del proceso
 * @member {string} ordenSubproceso: si es un subproceso
 * @member {string} estado: estado del proceso.
 * @member {string} fechaEstado: fecha del estado.
 * @member {string} ordenProceso: si es proceso padre.
 * @member {string} procesoPadreConsecutivo: consecutivo del proceso padre.
 * @member {programacionDeEjecucion[]} programacionDeEjecucion: procesos
 * programados que pertenecen a el proceso definido.
 * @member {Procesos[]} subprocesosAsociados: subprocesos que están asociados al
 * proceso definido.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */


export interface ProcesosDefinidos {
  consecutivo: number,
  nombre: string,
  descripcion: string,
  periodicidadEjecucion: string,
  fechaInicio: string,
  permitirEjecucionExtemp: string,
  activo: string,
  pantalla: string,
  ordenSubproceso: string,
  estado: string,
  fechaEstado: string,
  ordenProceso: number,
  procesoPadreConsecutivo: string
  programacionDeEjecucion: ProcesosProgramados[],
  subprocesosAsociados: Procesos[]
}
