/**
 * Interface que se utiliza para realizar peticiones que requieran
 * un proceso ejecutado.
 *
 * @interface ProcesoEjecutadoRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesoEjecutadoRequest {
  procesoEjecutadoConsecutivo: string,
  criterioCobertura: string,
  fechaInicio: string,
  estado: string,
  lineasCreditoCodigo: string,
  tipoLiquidacionCodigo: string,
  tipoNominaConsecutivo: string,
  centroCostoCodigo: string
  page: number,
  size: number,
  sort: string
}
