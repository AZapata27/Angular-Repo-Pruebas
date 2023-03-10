// imports
import { ProcesosXEjecucion } from './ProcesosXEjecucion.interface';


/**
 * permite mapear los procesos ejecutados.
 *
 * @interface ProcesosEjecutados
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesosEjecutados {
  consecutivo: number,
  fechaInicio: Date,
  estado: string,
  procesoTerminado: string,
  criterioCobertura: string,
  sucursalInicio?: string,
  sucursalFin?: string,
  lineaCredito?: string,
  tipoLiquidacion?: string,
  centroCosto?: string,
  tipoNomina?: string,
  creditos: CreditosPorProceso,
  creditosExcluir: CreditosExcluir,
  procesosIncluidos: ProcesosXEjecucion[]
}

/**
 * permite mapear los créditos por el proceso.
 *
 * @interface  CreditosPorProceso
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface CreditosPorProceso {
  content: CreditosPorProcesoContent[];
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}

/**
 * Representa el que será el content de los creditos por proceso.
 *
 * @interface CreditosPorProcesoContent
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface CreditosPorProcesoContent {
  consecutivo: string,
  numeroCredito: number,
  creditosConsecutivo: string
}


/**
 * Representa los creditos a excluir que pertenecen a un determinado
 * proceso ejecutado y todas las propiedades necesarias para la paginación.
 *
 * @interface CreditosExcluir
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface CreditosExcluir {
  content: CreditosExcluirContent[];
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


/**
 * Representa los créditos a excluir.
 *
 * @interface CreditosExcluirContent
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface CreditosExcluirContent {
  consecutivo: number;
  seleccionado: string;
  creditosConsecutivo: number;
  creditosMonto: number;
  creditosNumeroCredito: number;
  creditosVUsuarioCreditoConsecutivo: number;
  creditosVUsuarioCreditoTipoIdentificacion: string;
  creditosVUsuarioCreditoIdentificacion: string;
  creditosVUsuarioCreditoNombre: string;
  creditosVUsuarioCreditoApellidos: string;
}
