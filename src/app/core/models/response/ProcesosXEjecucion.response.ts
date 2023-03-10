//imports
import { ProcesosXEjecucion } from '../ProcesosXEjecucion.interface';

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * un array de procesosXEjecucion y sus respectivas propiedades para paginar.
 *
 * @interface ProcesosXEjecucionResponse
 * @member {ProcesosXEjecucion[]} content: array de procesos por Ejecución.
 * @member {number} totalElements: cantitad total general de procesos por ejecución.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesosXEjecucionResponse {
  content: ProcesosXEjecucion[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}
