import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SpinnerService {

  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerState$ = this.spinnerSubject.asObservable();

  private activeRequests = 0;

  constructor() {}

  show() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.spinnerSubject.next(true);
    }
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.spinnerSubject.next(false);
    }
  }

}
