/**
 * Enumerado de estados que puede tener un parametro.
 * Es utilizado en la pantalla parametros comunes.
 * @enum {string}
 * @see {@link https://www.typescriptlang.org/docs/handbook/enums.html}
 */
export enum estadoParametroEnum {
  CRE = "Creado pendiente por aprobar",
  ELI = "Eliminado",
  EPA = "Eliminado por aprobar",
  GRA = "Grabado",
  INA = "Inactivo",
  IPA = "Inactivo por aprobar",
  PPA = "Pendiente aprobacion",
  RPA = "Rechazado por aprobar",
  VIG = "Vigente",
  VPA = "Vigente por aprobar"
}
