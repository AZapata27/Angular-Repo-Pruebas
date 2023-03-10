/**
 * Interface que permite emitir mensaje de error o success.
 *
 * @interface Informativa
 *
 * interface de caracter informativo que mapea, los errores y los logs
 * del proceso, en el compoenente de resultado ejecución de procesos.
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface Informativa {
  fechaHora: Date,
  mensaje: string
}
