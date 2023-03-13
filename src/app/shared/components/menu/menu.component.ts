import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { UsuarioService } from "../../services/usuario.service";

@Component({
  selector: 'menu',
  template: '<p-panelMenu [model]="items"></p-panelMenu>',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(private menuService: UsuarioService) {
  }

  ngOnInit(): void {
    this.menuService.getMenu()
      .subscribe((menu) => {
        this.items = menu;
      })
  }

}
