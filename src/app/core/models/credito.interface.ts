/**
 * Esta interface se utiliza para mapear los creditos.
 *
 * @interface Credito
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface Credito {
  noCredito: number,
  monto: number,
  tipoIdentificacionTitular: string,
  identificacion: number,
  nombre: string,
  apellidos: string
}
