import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  EjecucionProcesosComponent
} from "./features/procesos/ejecucion-procesos/ejecucion-procesos.component";
import {
  ResultadoEjecucionProcesosComponent
} from "./features/procesos/resultado-ejecucion-procesos/resultado-ejecucion-procesos.component";
import { InicioComponent } from "./shared/components/inicio/inicio.component";
import {
  ConsultaProcesosProgramadosComponent
} from './features/procesos/consulta-procesos-programados/consulta-procesos-programados.component';
import {
  DefinicionProcesosComponent
} from './features/procesos/definicion-procesos/definicion-procesos.component';
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
  {path: 'actualizacion/procesos/resultados', component: ResultadoEjecucionProcesosComponent},
  {path: 'actualizacion/procesos/consulta', component: ConsultaProcesosProgramadosComponent},
  {path: 'actualizacion/procesos/definicion', component: DefinicionProcesosComponent},
  {path: 'actualizacion/procesos/ejecucion', component: EjecucionProcesosComponent},

  {path: '**', redirectTo: 'inicio-kepiaa'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
