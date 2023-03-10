/**
 * Este enumerado hace referencia a los distintos estados que puede tener
 * un proceso cuando fue ejecutado o está por ejecutar. Es utilizado en
 * la pantalla de resultado ejecución de procesos.
 * @enum {string}
 * @see {@link https://www.typescriptlang.org/docs/handbook/enums.html}
 */

export enum EstadoProcesosEjecucionEnum {
  EE = "EN EJECUCION",
  NE = "NO EJECUTADO",
  OK = "EJECUTADO SIN ERROR",
  TE = "EJECUTADO CON ERROR"
}
