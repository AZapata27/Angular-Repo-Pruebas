// imports
import { ParametroComun } from '../parametroComun.interface';

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * un array de parametros comunes y sus respectivas propiedades para paginar.
 *
 * @interface ParametrosComunesResponse
 * @member {ParametroComun []} content: array de parametros comunes.
 * @member {number} totalElements: cantitad total general de parámetros comunes.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ParametrosComunesResponse {
  content: ParametroComun [],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}
