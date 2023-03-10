// imports
import { estadoParametroEnum } from '../enums/estadoParametro.enum';
import { tipoLineaEnum } from '../enums/tipoLinea.enum';

/**
 * Interface que representa los diferentes criterios de cobertura
 * de kepiaa.
 *
 * @interface CriteriosCobertura
 *
 * @member {VrhRegional[]} regionalList : array de las regionales Banrep.
 * @member {VmTipoLiq[]} tipoLiquidacionList: array de los tipo de liquidacion.
 * @member {VmCentroCosto[]} centroCostoList: array de los centros de costo.
 * @member {VrhTipoNomina[]} tipoNominaList: array de tipos de nómina.
 * @member {ParLineasCredito[]} lineasCredito: array de lineas de crédito kepiaa.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface CriteriosCobertura {
  regionalList: VrhRegional[],
  tipoLiquidacionList: VmTipoLiq[],
  centroCostoList: VmCentroCosto[],
  tipoNominaList: VrhTipoNomina[],
  lineasCredito: ParLineasCredito[]
}


/**
 * regionales Banrep.
 *
 * @interface VrhRegional
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

interface VrhRegional {
  codigoLocalidad: number,
  codigoRegional: number,
  ciudad: number,
  departamento: number,
  ciudadNombre: string
}


/**
 * tipo liquidación.
 *
 * @interface VmTipoLiq
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
interface VmTipoLiq {
  tipoCodigo: string,
  tipoNombre: string,
  tipoAjustaA360: string
}


/**
 * Centros de costo.
 *
 * @interface VmCentroCosto
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
interface VmCentroCosto {
  codigo: number,
  nombre: string
}


/**
 * Tipos de nómina.
 *
 * @interface VrhTipoNomina
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
interface VrhTipoNomina {
  consecutivo: number,
  nombre: string
}


/**
 * Lineas de créditos.
 *
 * @interface CreditosVigentesRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
interface ParLineasCredito {
  numero: number,
  codigo: string,
  nombre: string,
  descripcion: string,
  constituyeGarantia?: string,
  plazo: string,
  numeroCodeudores: number,
  topeMaximoDescuento: number,
  estado: estadoParametroEnum,
  fechaEstado: Date,
  fechaInicioVigencia: Date,
  fechaFinVigencia: Date,
  tiempoUltimoCredio: Date,
  consultaCifin?: String,
  norma: string,
  permitirCederCredito?: string,
  usuarioCreacion: string,
  fechaCreacion: Date,
  usuarioModificacion: string,
  fechaModificacion: Date,
  tipoLinea: tipoLineaEnum,
  parTiposCredito: ParTiposCredito
}

/**
 * Tipos de crédito.
 * @interface ParTiposCredito
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
interface ParTiposCredito {
  consecutivo: number,
  codigo: string,
  descripcion: string,
  estado: estadoParametroEnum,
  fechaEstado: Date,
  usuarioCreacion: string,
  fechaCreacion: Date,
  fechaInicioVigencia: Date,
  fechaFinVigencia: Date,
  usuarioModificacion: string,
  fechaModificacion: Date,
  diasGracia: number,
  alturaMoraAdmin: number,
  alturaMoraJuridica: number
}
