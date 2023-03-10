import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  EjecucionProcesosPageComponent
} from "./features/procesos/ejecucion-procesos-page/ejecucion-procesos-page.component";
import {
  ResultadoEjecucionProcesosPageComponent
} from "./features/procesos/resultado-ejecucion-procesos-page/resultado-ejecucion-procesos-page.component";
import { InicioComponent } from "./shared/components/inicio/inicio.component";
import {
  ConsultaProcesosProgramadosPageComponent
} from './features/procesos/consulta-procesos-programados-page/consulta-procesos-programados-page.component';
import {
  DefinicionProcesosPageComponent
} from './features/procesos/definicion-procesos-page/definicion-procesos-page.component';
import {
  ParametrosEspecificosComponent
} from "./features/parametros/parametros-especificos/parametros-especificos.component";
import { ParametrosComunesComponent } from "./features/parametros/parametros-comunes/parametros-comunes.component";
import {
  ParametrosComunesPendientesComponent
} from "./features/parametros/parametros-comunes-pendientes/parametros-comunes-pendientes.component";


const routes: Routes = [
  {path: '', redirectTo: 'inicio-kepiaa'},
  {path: 'inicio-kepiaa', component: InicioComponent, pathMatch: 'full'},
  {path: 'administracion/parametros-generales/comunes', component: ParametrosComunesComponent},
  {path: 'administracion/parametros-generales/especificos', component: ParametrosEspecificosComponent},
  {path: 'administracion/parametros-generales/comunes/pendientes', component: ParametrosComunesPendientesComponent},
  {path: 'actualizacion/procesos/resultados', component: ResultadoEjecucionProcesosPageComponent},
  {path: 'actualizacion/procesos/consulta', component: ConsultaProcesosProgramadosPageComponent},
  {path: 'actualizacion/procesos/definicion', component: DefinicionProcesosPageComponent},
  {path: 'actualizacion/procesos/ejecucion', component: EjecucionProcesosPageComponent},
  {
    path: '**', redirectTo: 'inicio-kepiaa'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
