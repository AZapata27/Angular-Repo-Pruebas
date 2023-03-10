// imports
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Interface la cual está definida para tomar los errores en las respuestas
 * del API, dentro define una serie de propiedades que posteriormente son
 * utilizadas para realizar validaciones y mostrar mensajes al usuario.
 *
 * @interface APIErrorResponse
 * @extends {HttpErrorResponse}
 * @member {any} error: contiene un objeto de propiedades que vienen de la API,
 * según lo establecido, contiene:
 * - timestamp: la fecha
 * - path: el paquete
 * - cause: la causa del error.
 * - details: detalles del error.
 * - validations: validaciones que se encuentran en el servidor.
 * - stacktrace: traza error.
 *
 * Todo esto es utilizado para mostrar los mensajes.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html}
 * @see {@link https://angular.io/api/common/http/HttpErrorResponse}
 * @see {HttpErrorResponse} : class extends
 */

export interface APIErrorResponse extends HttpErrorResponse {
  error: {
    timestamp: string;
    path: string;
    cause: string;
    details: string;
    validations: null;
    stackTrace: string;
  }
}
