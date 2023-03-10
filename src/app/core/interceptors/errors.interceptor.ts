// imports Angular centrales
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

// imports RxJs
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// imports de funciones
import { MensajeService } from '../services/mensaje.service';
import { APIErrorResponse } from '../models/APIErrorResponse';

/**
 * Clase que utiliza un interceptor, la cual tiene como carcateristica capturar y
 * mostrar todos los errores HTTP que puedan ocurrir en para las respuestas.
 * @implements {HttpInterceptor}
 * @see {@link https://angular.io/api/common/http/HttpInterceptor. }
 *
 * @author Jose Osorio Catalan <jcosorio@indracompany.com>
 */


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * @constructor
   * @param {MensajeService} mensajeService: propiedad del servicio Mensaje, el cual
   * permite mostrar un mensaje por pantalla si sucede un error.
   */
  constructor(private mensajeService: MensajeService) {
  }

  /**
   *  @method intercept: método que hace parte de la interface HttpInterceptor
   *  intercepta las solicitudes y respuestas HTTP. Realiza una validación previa,
   *  si hay conexión a internet, luego hace la petición y espera la respuesta,
   *  si sucede algún error simplemente verifica el tipo de error, y según el código
   *  http lanza el mensaje.
   *  @param  {HttpRequest<any>} request: dato de tipo HttpRequest recibe la peticion.
   *  @param {HttpHandler} next : dato de tipo HttpHandler el cual transforma
   *    una HttpRequest en una secuencia de HttpEvents, una de las cuales
   *    probablemente sea HttpResponse y se usa para retornar un observable
   *    de tipo HttpEvent.
   * - @returns {Observable<HttpEvent<any>>}
   */

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!window.navigator.onLine) {
      this.mensajeService.mostrarMensajeError(
        {
          showMessage: true,
          detalles: "No hay conexion a internet.",
          icon: ""
        });
    }

    return next.handle(request).pipe(
      catchError((error: APIErrorResponse) => {

        // hay posibilidad de que a futuro se agreguen más códigos.
        switch (error.status) {

          case 400: //Bad request
            this.mensajeService
              .mostrarMensajeError({showMessage: true, detalles: error.error.details, icon: ""});
            break;

          case 404: // Not found
            this.mensajeService
              .mostrarMensajeError({showMessage: true, detalles: error.error.details, icon: ""});
            break;

          case 500: // Server error
            this.mensajeService
              .mostrarMensajeError({
                showMessage: true,
                detalles: "Ocurrió un error en el servidor.",
                icon: ""
              });
            break;
        }

        return throwError(error);
      })
    );
  }


}
