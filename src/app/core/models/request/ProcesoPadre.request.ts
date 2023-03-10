/**
 * Corresponde a las peticiones de los procesos padre.
 * @interface ProcesoPadreRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */


export interface ProcesoPadreRequest {
  consecutivo: number;
  periodicidadEjecucion: string;
  permitirEjecucionExtemp: string;
  activo: string;
}
