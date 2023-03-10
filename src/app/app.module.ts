// Módulos

// Centrales
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

// Compartidos
import { SharedPrimeNgModule } from './shared/SharedPrimeNg.module';

// De funciones
import { AppComponent } from './app.component';
import { SpinnerModulo } from './shared/components/spinner/spinner.module';
import { SpinnerInterceptor } from './core/interceptors/spinner.interceptors';
import { ErrorInterceptor } from './core/interceptors/errors.interceptor';
import { MenuModule } from './shared/components/menu/menu.module';
import { ParametrosModule } from './features/parametros/parametros.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProcesosModule } from './features/procesos/procesos.module';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

/**
 * Permite utilizar el modulo de traduccíon para elementos y componentes
 * que estén en inglés o en un idioma diferente, como el calendario.
 * @param http : corresponde a una variable de tipo httpClient.
 * @returns {TranslateHttpLoader}
 */

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// permite registrar la localización, el código para colombia es pt-CO

registerLocaleData(localePt, 'pt-CO');


@NgModule({
  declarations: [
    AppComponent // Componente principal.
  ],

  imports: [
    BrowserModule, // Modulo de navegación
    RouterModule, // Módulo de rutas de Angular
    SharedPrimeNgModule, // Módulo de componentes compartidos.
    AppRoutingModule,  // Módulo raiz que contiene las rutas.
    HttpClientModule, // Módulo HttpClient, necesario para las peticiones.
    SpinnerModulo, // Módulo Spinner.
    MenuModule, // Módulo del Menú.
    ProcesosModule, // Módulo de procesos que contiene todo lo que corressponde con procesos.
    ParametrosModule, // Módulo de parámetros y todo lo relacionado con los parametros en kepiaa.

    /**
     * Este módulo es utilizado para traducir elementos que estén en
     * idioma inglés, puesto que primeng en v13 obliga a utilizar el api
     * de internacionalización i18n para la traducción de componentes y elementos.
     * @see {@link https://github.com/ngx-translate/core}
     */

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  /**
   * Contiene un array de providers, entre los cuales están:
   *
   * - El provide para la traducción de elementos y componentes que estén en inglés.
   *
   * - El provide que permite encontrar las rutas de la aplicación y le agrega el hash o
   *   simbolo número al armar la url.
   *   @see {@link https://angular.io/api/common/HashLocationStrategy }
   *
   * - El provide del intercetor de carga spinner para peticiones y respuestas http,
   * y es multi porque es general en toda la app.
   *
   *
   * - El provide del interceptor de errores, para capturar los errores en peticiones
   * y respuestas. Tambien es multi para que sea tomado en toda la app.
   */
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-CO' // el valor para Colombia es  'pt-CO'
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
