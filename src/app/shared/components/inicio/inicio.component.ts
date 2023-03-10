import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'inicio',
  template: `

<img src="./assets/images/logo-banrep.svg" class="moneda"
 alt="LogoMoneda" id="LogoMoneda" width="200" height="200">

  <h1>KEPIAA - Sistema de Crédito y Cartera</h1>
  <p>
  Herramienta que permite la administración de los créditos y la administración de la cartera de vivienda del Banco de la República.
  El Banco de la República cuenta con un Departamento de Operaciones Institucionales y Vivienda (DOIV) quien entre otras
  funciones otorga préstamos institucionales para vivienda y administra y controla la cartera y garantí­as
  provenientes de esta actividad crediticia.
  </p>
  `,
  styleUrls: ['./inicio.component.css']

})
export class InicioComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {
  }

}


