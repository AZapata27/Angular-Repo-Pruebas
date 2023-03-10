//imports
import { ValorParametroContent } from "./valorParametro.interface";

/**
 * interface que representa un parametro común.
 *
 * @interface ParametroComun
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ParametroComun {
  consecutivo: number;
  tipo: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  grupo: string;
  tipoValidacion: string;
  multivaluado: string;
  tipoDato: string;
  longitud: number;
  unidad: string;
  precision: number;
  valoresParametros: ValorParametroContent;
}

