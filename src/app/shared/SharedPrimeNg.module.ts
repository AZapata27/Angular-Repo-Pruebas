// Modulos

// Centrales
import { NgModule } from '@angular/core';

// PrimeNg
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { InicioComponent } from './components/inicio/inicio.component';
import { CreditosEpecificosComponent } from './components/creditos-epecificos/creditos-epecificos.component';
import { BrowserModule } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { MensajeErrorComponent } from './components/mensaje-error/mensaje-error.component';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { RestriccionInputRegexDirective } from './directives/restriccion-input-regex.directive';

@NgModule({
  declarations: [
    InicioComponent,
    MensajeErrorComponent,
    CreditosEpecificosComponent,
    RestriccionInputRegexDirective
  ],
  imports: [
    DropdownModule,
    InputTextModule,
    BrowserModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    ToastModule,
    BreadcrumbModule,
    DynamicDialogModule,
    PanelMenuModule,
    CardModule,
    DialogModule,
    ReactiveFormsModule

  ],
  exports: [
    DropdownModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    ToastModule,
    BreadcrumbModule,
    DynamicDialogModule,
    PanelMenuModule,
    CardModule,
    MensajeErrorComponent,
    RestriccionInputRegexDirective
  ],
  providers: [
    MessageService
  ]

})
export class SharedPrimeNgModule {
}
