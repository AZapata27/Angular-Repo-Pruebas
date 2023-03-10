/**
 * Interface que se utiliza para guardar proceso ejecutado.
 *
 * @interface procesoEjecutadoGuardarRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface procesoEjecutadoGuardarRequest {

  fechaInicio: string;
  fechaFinalizacion: string;
  sucursalInicioCodigoLocalidad: string;
  sucursalFinCodigoLocalidad: string;
  criterioCobertura: string;
  lineaCredito: string;
  tipoLiquidacionTipoCodigo: string;
  centroCostoCodigo: string;
  tipoNominaConsecutivo: string;
  creditosEspecificosConsecutivos: any[];
}
