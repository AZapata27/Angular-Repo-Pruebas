/**
 * Esta interface se utiliza para realizar un request de los créditos vigentes
 * que se encuentran en kepiaa.
 *
 * @interface CreditosVigentesRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface CreditosVigentesRequest {
  numeroCredito: string,
  lineasCreditoConsecutivo: string,
  tipoIdentificacion: string,
  identificacionTitular: string,
  nombreTitular: string,
  apellidosTitular: string,
  monto: string,
  page: number,
  size: number
}
