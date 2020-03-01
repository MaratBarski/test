import { Component, Input } from '@angular/core';

export class MenuLink {
  text: string;
  icon?: string;
  disable?: boolean;
  click: any;
  source?: any;
}

@Component({
  selector: 'mdc-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent {
  @Input() links: Array<MenuLink>;
  @Input() sublinks: Array<MenuLink>;  
}
