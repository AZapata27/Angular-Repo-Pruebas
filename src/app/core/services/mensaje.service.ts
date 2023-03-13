import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MensajeAlerta } from '../../shared/models/mensaje-alerta';

@Injectable({
  providedIn: 'root',

})
export class MensajeService {

  messageSubject: BehaviorSubject<MensajeAlerta> = new BehaviorSubject<MensajeAlerta>({
    showMessage: false,
    detalles: "",
    icon: ""
  });

  constructor() {
  }

  mostrarMensajeError(error: MensajeAlerta) {
    //console.log(error)
    error.icon = "pi pi-times-circle";
    this.messageSubject.next(error);
  }

  cerrarMensaje() {
    this.messageSubject.next({showMessage: false, detalles: "", icon: ""});
  }

  mostrarMensajeExitoso(success: MensajeAlerta) {
    success.icon = "pi pi-exclamation-circle";
    this.messageSubject.next(success);
  }


}
