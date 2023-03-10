// imports
import { EstadoProcesosEjecucionEnum } from '../enums/estadoProcesosEjecucion.enum';


/**
 * Esta interface es utilizada para mapear los procesos por ejecución.
 * Es utilizada en el componente de resultado Ejecucion de procesos.
 *
 * @interface ProcesosXEjecucion
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesosXEjecucion {
  procesoXEjecucionConsecutivo: number;
  numeroProcesoEjecutado: number;
  procesoConsecutivo: number;
  nombreProceso: string;
  nombreSubproceso: string;
  fechaInicio: Date;
  EstadoProcesosEjecucionEnum: EstadoProcesosEjecucionEnum
}
