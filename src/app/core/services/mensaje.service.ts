import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EmitirMensaje } from '../models/EmitirMensaje.interface';

@Injectable({
  providedIn: 'root',

})
export class MensajeService {

  messageSubject: BehaviorSubject<EmitirMensaje> = new BehaviorSubject<EmitirMensaje>({
    showMessage: false,
    detalles: "",
    icon: ""
  });

  constructor() {
  }

  mostrarMensajeError(error: EmitirMensaje) {
    //console.log(error)
    error.icon = "pi pi-times-circle";
    this.messageSubject.next(error);
  }

  cerrarMensaje() {
    this.messageSubject.next({showMessage: false, detalles: "", icon: ""});
  }

  mostrarMensajeExitoso(success: EmitirMensaje) {
    success.icon = "pi pi-exclamation-circle";
    this.messageSubject.next(success);
  }


}
