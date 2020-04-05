import { Component, Input, Output, EventEmitter } from '@angular/core';

export class MenuLink {
  text: string;
  icon?: string;
  disable?: boolean;
  click?: any;
  source?: any;
  command?: string;
  hidden?: boolean;
}

@Component({
  selector: 'mdc-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent {

  @Output() onCommand = new EventEmitter<string>();
  @Input() links: Array<MenuLink>;
  @Input() sublinks: Array<MenuLink>;

  exec(link: MenuLink, event: any): void {
    if (!link.command) { return; }
    if (link.disable) { return; }
    this.onCommand.emit(link.command);
  }
}
