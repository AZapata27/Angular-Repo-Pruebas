/**
 * Interface que permite emitir mensaje de error o success.
 *
 * @interface EmitirMensaje
 *
 * @member {boolean} showMessage: indica si se muestra mensaje o no.
 * @member {string} detalles: muestra de que se trató el error.
 * @member {string} icon: icono que será mostrado.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface EmitirMensaje {
  showMessage: boolean,
  detalles: string,
  icon: string
}
