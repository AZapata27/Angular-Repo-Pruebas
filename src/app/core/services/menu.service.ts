import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api/menuitem';
import { environment } from 'environments/environment';
import { perfilesS3Enum } from "../enums/perfilesS3.enum";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // Hace referencia a la URL de la API que se va a consumir
  // endpoint - local: usuario/api/v1/menu
  readonly API_SERVER = environment.hostApiMenu + 'usuario/api/v1';


  constructor(private http: HttpClient) {
  }

  public getMenu(): Observable<MenuItem[]> {

    return this.http.get<MenuItem[]>(this.API_SERVER + "/menu");
  }

  public getPerfiles(): Observable<perfilesS3Enum[]> {
    return this.http.get<any>(this.API_SERVER + "/perfiles");
  }

}
