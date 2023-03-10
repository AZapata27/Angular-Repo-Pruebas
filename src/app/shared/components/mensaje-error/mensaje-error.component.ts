import { Component, OnInit } from '@angular/core';
import { MensajeService } from '../../../core/services/mensaje.service';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'mensaje-error',
  templateUrl: 'mensaje-error.component.html'
})
export class MensajeErrorComponent implements OnInit {

  mostrarMensaje: boolean = false;
  detalleMensaje: string = "";
  icon: string = "";


  constructor(private mensajeService: MensajeService) {

  }

  ngOnInit(): void {
    this.listenToError();
  }

  cerrarModalError() {
    this.mensajeService.cerrarMensaje();
  }

  listenToError(): void {
    this.mensajeService
      .messageSubject
      .pipe(delay(0))
      .subscribe(mensajeEmitido => {
        this.mostrarMensaje = mensajeEmitido.showMessage;
        this.detalleMensaje = mensajeEmitido.detalles;
        this.icon = mensajeEmitido.icon;
      })
  }

}
