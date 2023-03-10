/**
 * Interface procesos, que permite mapear los procesos.
 *
 * @interface Procesos
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */
export interface Procesos {
  consecutivo: number;
  nombre: string;
  descripcion: string;
  periodicidadEjecucion: string;
  fechaInicio: string,
  permitirEjecucionExtemp: string;
  activo: string;
  pantalla: string;
  ordenSubproceso: number;
  estado: string;
  fechaEstado: string;
  ordenProceso: number;
  procesoPadreConsecutivo: number;
}
