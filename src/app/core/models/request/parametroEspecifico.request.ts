/**
 * Interface que se utiliza para realizar una petición de un parametro
 * especifico con la estructura de la interface.
 *
 * @interface ParametroEspecificoRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ParametroEspecificoRequest {
  codigo: string,
  nombre: string,
  descripcion: string,
  tipoValidacion: string,
  grupo: string,
  page: number,
  size: number,
}
