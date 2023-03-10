export interface ValorParametroContent {
  content: ValorParametro [],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}


export interface ValorParametro {
  parConsecutivo: number;
  numero: number;
  descripcion: string;
  valor: string;
  fechaVigencia: string;
  valorMaximo: string;
  fechaFinVigencia: string;
  estado: string;
  fechaEstado: string;
}
