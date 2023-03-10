/**
 * Interface que se utiliza para realizar peticion de parametros comunes.
 *
 * @interface ParametroComunRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ParametroComunRequest {
  codigo: string,
  nombre: string,
  descripcion: string,
  grupo: string,
  tipoValidacion: string,
  multivaluado: string,
  tipoDato: string
  longitud: string,
  unidad: string,
  precision: string,
  page: number,
  size: number
}
