// imports
import { CreditoVigente } from '../creditoVigente.interface';

/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * unos créditos vigentes.
 *
 * @interface CreditosVigentesResponse
 * @member {CreditoVigente[]} content: array de creditos vigentes.
 * @member {number} totalElements: cantitad total general de créditos vigentes.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varia según el
 * size que se haya ingresado.
 * @member {number} size: cantitad de elementos por pagina.
 * @member {number} number: número de página.
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface CreditosVigentesResponse {
  content: CreditoVigente[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


