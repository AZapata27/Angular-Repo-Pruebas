import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ParametrosModule } from './features/parametros/parametros.module';
import { ProcesosModule } from './features/procesos/procesos.module';
import { CoreModule } from "./core/core.module";

@NgModule({
  declarations: [
    AppComponent // Componente principal.
  ],

  imports: [
    BrowserModule, // Modulo de navegación
    RouterModule, // Módulo de rutas de Angular

    CoreModule, // Módulo de configuración de la aplicación.
    SharedModule, // Módulo de componentes compartidos.
    AppRoutingModule,  // Módulo raiz que contiene las rutas.
    ProcesosModule, // Módulo de procesos que contiene lo que corresponde con procesos.
    ParametrosModule, // Módulo de parámetros y lo relacionado con los parametros en kepiaa.
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CO'},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
