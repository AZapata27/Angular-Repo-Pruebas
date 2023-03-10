// imports Angular centrales
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, finalize, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// imports de funciones
import { SpinnerService } from '../services/spinner.service';


/**
 * Clase que utiliza un interceptor genérico que se utiliza en toda la
 * aplicacion el cual permite capturar las peticiones HTTP y las respuestas.
 * por ello utiliza un loader que le indica al usuario que se está procesando
 * la solicitud.
 * @implements {HttpInterceptor}
 * @see {@link https://angular.io/api/common/http/HttpInterceptor} .
 *
 * @author Jose Osorio Catalan <jcosorio@indracompany.com>
 */

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  /**
   * @constructor
   * @param {SpinnerService} spinnerService: propiedad de servicio del spinner
   * que se va a mostrar.
   */
  constructor(private spinnerService: SpinnerService) {
  }


  /**
   *  @method intercept: método que hace parte de la interface HttpInterceptor
   *  intercepta las solicitudes y respuestas HTTP. Establece el loader mientras se
   *  realiza la petición. Si ocurre un error lanza un observable.
   * -> @param  {HttpRequest<any>} request: dato de tipo HttpRequest recibe la peticion.
   * -> @param {HttpHandler} next : dato de tipo HttpHandler el cual transforma
   *    una HttpRequest en una secuencia de HttpEvents, una de las cuales
   *    probablemente sea HttpResponse y se usa para retornar un observable
   *    de tipo HttpEvent
   * - @returns {Observable<HttpEvent<any>>} la respuesta de la peticion y establece la visibilidad del
   * loader a falso.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.setLoading(true, request.url);

    return next
      .handle(request)
      .pipe(finalize(() => this.spinnerService.setLoading(false, request.url)),
        catchError((error: HttpErrorResponse) => {
          return new Observable<HttpEvent<any>>();
        }));
  }


}
