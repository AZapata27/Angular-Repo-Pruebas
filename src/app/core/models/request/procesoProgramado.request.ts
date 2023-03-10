/**
 * Esta interfaz permite realizar peticiones que envien un proceso
 * programado.
 *
 * @interface ProcesoProgramadoRequest
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesoProgramadoRequest {
  nombreProceso: string,
  tipo: string,
  fechaInicio: string,
  fechaEspecifica: string,
  soloDiaHabil: string,
  domingo: string,
  lunes: string,
  martes: string,
  miercoles: string,
  jueves: string,
  viernes: string,
  sabado: string,
  diaMes: string,
  page: number,
  size: number,
  sort: string
}

/**
 * Corresponde a los procesos programados que se guardarán, es decir,
 * que serán creados o si es necesario, seran modificados en varias
 * propiedades.
 *
 * @interface procesoProgramadoRequestGuardar
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface procesoProgramadoRequestGuardar {
  fechaInicio: null | string;
  diaMes: null | string;
  alternada: null | string;
  soloDiaHabil: null | string;
  domingo: null | string;
  lunes: null | string;
  martes: null | string;
  miercoles: null | string;
  jueves: null | string;
  viernes: null | string;
  sabado: null | string;
  diaSemana: null | string;
  fechaEspecifica: null | string;
  procesosConsecutivo: null | string;
}
