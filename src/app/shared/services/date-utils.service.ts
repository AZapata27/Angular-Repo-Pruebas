import { Injectable } from '@angular/core';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  readonly DATE_FORMAT_DD_MM_YYYY: string = 'DD-MM-YYYY';

  constructor() {
  }

  //Funcion que recibe una fecha tipo Date y la devuelve en formato dd-mm-yyyy usando la libreria moment
  formatDateToDD_MM_YYYY(date: Date | string): string {

    if (date === null || date === '' || date === undefined) {
      return '';
    }

    return moment(date, this.DATE_FORMAT_DD_MM_YYYY).format(this.DATE_FORMAT_DD_MM_YYYY);

  }

  getDateNowString(): string {
    return moment(new Date()).format(this.DATE_FORMAT_DD_MM_YYYY);
  }
}
