import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { RegexPattern } from "../models/enums/regex-pattern";

@Directive({
  selector: '[restriccionInputRegex]'
})
export class RestriccionInputRegexDirective {

  @Input() regex: RegexPattern | undefined;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {
  };

  //validar que el input tenga un pattter regex en la directiva
  ngOnInit() {
    if (this.regex === undefined) {
      throw new Error("No se ha ingresado un PATTER regex para validar el input de la directiva [validacionAlfanumerica]");
    }
  }


  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {

    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('text');

    const longitudMaximaInput = this.el.nativeElement.attributes['maxLength'].value;

    if (this.regex === undefined) {
      throw new Error("No se ha ingresado un PATTER regex para validar el input de la directiva [validacionAlfanumerica]");
    }

    let regex = this.regex.toString().replace(/%/g, longitudMaximaInput);
    let regexFinal: RegExp = new RegExp(regex);

    if (!regexFinal.test(pastedData)) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

    if (this.regex === undefined) {
      throw new Error("No se ha ingresado un PATTER regex para validar el input de la directiva [validacionAlfanumerica]");
    }

    let regex = this.regex.toString().replace(/%/g, "1");
    let regexFinal: RegExp = new RegExp(regex);
    if (regexFinal.test(event.key) || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return;
    } else {
      event.preventDefault();
    }

    return;
  }
}
