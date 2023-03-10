import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CreditoVigente } from '../models/creditoVigente.interface';
import { CreditosVigentesRequest } from '../models/request/creditosVigentes.request';
import { CreditosVigentesResponse } from '../models/response/CreditosVigentes.response';

@Injectable({
  providedIn: 'root'
})

/**
 * Service encargado de manejar todo lo relacionado con los créditos especificos.
 * Tiene como caracteristica que es generico, y se usará cuando el usuario desee escoger cualquier
 * crédito. Se usa en el componente compartido de créditos especificos.
 */

export class CreditosEspecificosService {

  // Array de creditos vigentes.
  creditosList: CreditoVigente[] = [];

  // Array de tipo BehaviorSubject<CreditoVigente[]> que será emitida cada que el usuario escoja los crédito.
  creditosListSubject: BehaviorSubject<CreditoVigente[]> = new BehaviorSubject<CreditoVigente[]>(this.creditosList);

  // numero de crédito seleccionado que se emite cada que el usuario escoge un crédito.
  nuevoCreditoSeleccionado: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  // Hace referencia a la URL de la API que se va a consumir
  private readonly API_SERVER = environment.hostApiProcesos + 'procesos/api/v1';


  // constructor
  constructor(private http: HttpClient) {
  }


  /**
   * GET request: obtiene todas las lineas de crédito, y las transforma con el
   * pipe, mapeando sólo el combre y el consecutivo de cada línea.
   * @returns {Observable<any> }
   */
  public getLineasCredito(): Observable<any> {
    return this
      .http
      .get<any>(`${this.API_SERVER}/criterios-cobertura/lineasCredito`)
      .pipe(map<any[], SelectItem[]>(res => {

        const data = res.map(linea => ({
          label: linea.nombre,
          value: linea.consecutivo
        }));

        data.unshift({label: "", value: 0});

        return data;
      }));
  }

  /**
   * GET request: obtiene todos los créditos vigentes.
   * @returns { Observable<CreditosVigentesResponse>}
   */
  getCreditosVigentes(page: number, size: number): Observable<CreditosVigentesResponse> {

    // se le pasará el page y el size.
    return this
      .http
      .get<CreditosVigentesResponse>(`${this.API_SERVER}/creditos/vigentes`,
        {params: {"page": page, "size": size}});
  }


  /**
   * GET request: obtiene todos los créditos vigentes que coincidan con el objeto que se envía.
   *
   * @param {CreditosVigentesRequest} request: objeto de crédito vigente que será enviado en la busqueda.
   * @returns {Observable<CreditosVigentesResponse>}
   */
  busquedaPorFiltro(request: CreditosVigentesRequest): Observable<CreditosVigentesResponse> {
    return this.http.get<CreditosVigentesResponse>(`${this.API_SERVER}/creditos/vigentes/busqueda-filtro?`,
      {params: JSON.parse(JSON.stringify(request))});
  }


  /**
   * contiene los items de busqueda.
   * @returns {SelectItem[]}
   */
  cargarOpcionesBuqueda() {

    const itemsBusqueda: SelectItem[] = [
      {label: 'Número Crédito', value: 1},
      {label: 'Tipo Identificación Titular', value: 2},
      {label: 'Identificación Titular', value: 3},
      {label: 'Nombre Titular', value: 4},
      {label: 'Apellidos Titular', value: 5},
      {label: 'Linea de Crédito', value: 6},
      {label: 'Monto', value: 7},
    ]
    return itemsBusqueda;
  }


  /**
   * contiene las opciones de tipo de identificación para un usuario de un crédito.
   * @returns { SelectItem[]}
   */
  cargarOpcionesTipoIdentifiacion() {

    const itemsBusqueda: SelectItem[] = [
      {label: '   ', value: ''},
      {label: 'CÉDULA DE CIUDADANIA', value: 'CEDULA DE CIUDADANIA'},
      {label: 'CÉDULA DE EXTRANJERIA', value: 'CEDULA DE EXTRANJERIA'},
      {label: 'LICENCIA DE CONDUCCIÓN', value: 'LICENCIA DE CONDUCCION'},
      {label: 'NUMERO DE IDENTIFICACIÓN TRIBUTARIA NIT', value: 'NUMERO DE IDENTIFICACIÓN TRIBUTARIA NIT'},
      {label: 'NUMERO UNICO DE IDENTIFICACION PERSONAL', value: 'NUMERO UNICO DE IDENTIFICACION PERSONAL'},
      {label: 'PASAPORTE', value: 'PASAPORTE'},
      {label: 'REGISTRO CIVIL', value: 'REGISTRO CIVIL'},
      {label: 'SIN DOCUMENTO DE IDENTIDAD', value: 'SIN DOCUMENTO DE IDENTIDAD'},
      {label: 'TARJETA DE EXTRANJERIA', value: 'TARJETA DE EXTRANJERIA'},
      {label: 'TARJETA DE IDENTIDAD', value: 'TARJETA DE IDENTIDAD'}]

    return itemsBusqueda;
  }


  /**
   * Establece un crédito vigente, y evalúa que el crédito seleccionado no sea el mismo
   * que el anterior (sí eligió uno anteriormente) , si no ha sido elegido simplemente
   * emite lo agrega a la lista, y emite la lista y el numero de credito seleccionado.
   * @param {CreditoVigente} credito
   */
  setCreditoSeleccionado(credito: CreditoVigente) {

    if (this.creditosList.filter(cre => cre.consecutivo === credito.consecutivo).length === 0) {
      this.creditosList = [];
      this.creditosList.push(credito);
      this.creditosListSubject.next(this.creditosList);
      this.nuevoCreditoSeleccionado.next(credito.consecutivo);
    }
  }


  /**
   * Se limpia la lista.
   */
  borrarTodo() {
    this.creditosList = [];
  }


}
