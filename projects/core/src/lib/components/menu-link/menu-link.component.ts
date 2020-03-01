import { Component, Input } from '@angular/core';
import { MenuLink } from '../modal-menu/modal-menu.component';

@Component({
  selector: 'mdc-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.css']
})
export class MenuLinkComponent {
  @Input() link: MenuLink;
}
