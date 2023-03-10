/**
 * interface que representa un parametro especifico.
 *
 * @interface ParametroEspecifico
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface ParametroEspecifico {
  consecutivo: number;
  tipo: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  grupo: string;
  tipoValidacion: string;
}
