/**
 * Interface que se utiliza para guardar un parametro comun.
 *
 * @interface ParametroComunAGuardarRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ParametroComunAGuardarRequest {
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
}
