//imports
import { ProcesosEjecutados } from "../ProcesosEjecutados.interface";

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * un array de procesos ejecutados y sus respectivas propiedades para paginar.
 *
 * @interface  ProcesosEjecutadosResponse
 * @member {ProcesosEjecutados[]} content: contiene un array de procesos ejecutados.
 * @member {number} totalElements: cantitad total general de procesos ejecutados.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ProcesosEjecutadosResponse {
  content: ProcesosEjecutados[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


