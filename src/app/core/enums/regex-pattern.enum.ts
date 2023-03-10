export enum RegexPatternEnum {

  //Patron regex para validar que el input solo acepte numeros
  NUMEROS = '^[0-9]{1,%}$',

  //Patron regex para validar que el input solo acepte texto sin espacios
  TEXTO_SIN_ESPACIO = '^[a-zA-Z]{1,%}$',

  //Patron regex para validar que el input solo acepte alfanumerico
  ALFANUMERICO = '^[a-zA-Z0-9\\s]{1,%}$',

  //Patron regex para validar que el input solo acepte alfanumerico sin espacios
  ALFANUMERICO_SIN_ESPACIO = '^[a-zA-Z0-9]{1,%}$',

  //Patron regex para validar fechas en formato dd-mm-yyyy
  FECHA_DD_MM_YYYY = '^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](19|20)\\d\\d$',

}
