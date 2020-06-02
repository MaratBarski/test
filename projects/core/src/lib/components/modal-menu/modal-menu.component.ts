import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

export class MenuLink {
  text: string;
  icon?: string;
  command?: string;
  click?: any;
  source?: any;
  hidden?: boolean;
  disable?: boolean;
  checkDisabled?: any;
  checkHidden?: any;
}

@Component({
  selector: 'mdc-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent implements AfterViewInit {

  @Output() onCommand = new EventEmitter<string>();
  @Output() onInit = new EventEmitter<ModalMenuComponent>();
  @Input() links: Array<MenuLink>;
  @Input() sublinks: Array<MenuLink>;
  @Input() componentID: string;

  exec(link: MenuLink, event: any): void {
    if (!link.command) { return; }
    if (link.disable) { return; }
    this.onCommand.emit(link.command);
  }

  ngAfterViewInit(): void {
    this.onInit.emit(this);
  }
}
