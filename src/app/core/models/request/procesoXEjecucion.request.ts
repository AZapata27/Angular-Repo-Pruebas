/**
 * interface que será enviada en las paticiones, corresponde a los procesos
 * por ejecucion, es utiliza en el componente de resultado ejecución
 * de procesos.
 *
 * @interface ProcesosXEjecucionRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesosXEjecucionRequest {
  numeroProcesoEjecutado: string,
  nombreProceso: string,
  nombreSubproceso: string,
  fechaInicio: string,
  fechaFinalizacion: string,
  estadoProceso: string,
  page: number,
  size: number,
  sort: string
}
