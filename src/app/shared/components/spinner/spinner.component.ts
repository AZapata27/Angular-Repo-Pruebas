import { Component } from '@angular/core';
import { SpinnerService } from 'app/core/services/spinner.service';


@Component({
  selector: 'spinner',
  template: `
    <div class="progress-spinner" *ngIf="isLoading$ | async">
      <p-progressSpinner styleClass="custom-spinner" animationDuration="1">
      </p-progressSpinner>
    </div>`,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  isLoading$ = this.spinnerService.spinnerState$;

  constructor(private spinnerService: SpinnerService) {
  }

}
