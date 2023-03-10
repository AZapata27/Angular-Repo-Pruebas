/**
 * Esta interface es utilizada para representar un objeto de los créditos
 * Vigentes.
 *
 * @interface CreditoVigente
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface CreditoVigente {
  consecutivo: number,
  numeroCredito: number,
  lineaCredito: string,
  monto: number,
  tipoIdentificacionTitular: string,
  identificacionTitular: number,
  nombreTitular: string,
  apellidosTitular: string,
  estado: string
}
