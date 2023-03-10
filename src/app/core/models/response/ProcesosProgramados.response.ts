/**
 * Esta interface permite mapear una respuesta de la API, la cual devuelve
 * un array de parametros comunes y sus respectivas propiedades para paginar.
 *
 * @interface ProcesosProgramadosResponse
 * @member {ProcesosProgramados[]} content: array de procesos programados.
 * @member {number} totalElements: cantitad total general de procesos programados.
 * @member {number} totalPages: cantidad total de paginas de elementos. Varía según
 * el size que se haya ingresado.
 * @member {number} size: cantitad de elementos por página.
 * @member {number} number: número de página.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html }
 */

export interface ProcesosProgramadosResponse {
  content: ProcesosProgramados[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


/**
 * Esta interface es un modelo de un proceso programado, tiene como
 * carácteristica que todas las propiedades pueden ser nulas, puesto
 * que así lo está requeriendo en el controlador. Es decir, no trabaja con
 * string vacios, por lo tanto deben ir nulos.
 *
 * @interface ProcesosProgramados
 */
export interface ProcesosProgramados {
  consecutivo: number | null;
  procesosConsecutivo: number | null;
  procesosNombre: string | null;
  tipo: string | null;
  fechaInicio: string | null;
  ultimaFechaEjecucion: string | null;
  soloDiaHabil: string | null;
  domingo: string | null;
  lunes: string | null;
  martes: string | null;
  miercoles: string | null;
  jueves: string | null;
  viernes: string | null;
  sabado: string | null;
  diaSemana: string | null;
  diaMes: number | null;
  fechaEspecifica: string | null;
  alternada: string | null;
  procesosProcesoPadreConsecutivo: string | null;
}
