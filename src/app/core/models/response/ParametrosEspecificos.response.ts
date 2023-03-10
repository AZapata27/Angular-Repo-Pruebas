// imports
import { ParametroEspecifico } from "../parametroEspecifico.interface";

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * unos parametros especificos y sus respectivas propiedades para paginar.
 *
 * @interface ParametroEspecificoResponse
 * @member {ParametroEspecifico[]} content: array de parametros especificos.
 * @member {number} totalElements: cantitad total general de parámetros especificos.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html}
 */

export interface ParametroEspecificoResponse {
  content: ParametroEspecifico[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}
