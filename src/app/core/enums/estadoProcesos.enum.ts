/**
 * Este enumerado hace referencia a los diferentes estados que
 * puede tener un proceso que se encuentra en la ejecucion de procesos.
 * @enum {string}
 * @see {@link https://www.typescriptlang.org/docs/handbook/enums.html}
 */

export enum EstadoProcesosEnum {
  CAN = "CANCELADO", //*
  DEF = "DEFINIDO", // *
  DEP = "DESPUES DESHACER", //*
  EJE = "EJECUTANDOSE",
  EJP = "EJECUTANDOSE",//*
  ELI = "ELIMINADO", //*
  FIN = "FINALIZADO", //*
  PAP = "PAUSADO",
  PAU = "PAUSADO",
  REV = "REVISADO",//*
  SUS = "SUSPENDIDO",//*
  TEP = "TERMINADO",// *
  TER = "TERMINADO"//*
}
