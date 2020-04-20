import { Component } from '@angular/core';
import { ComponentService } from '../../services/component.service';

enum Icon {
  hamburgerOpen = 'ic-hamburger',
  hamburgerClose = 'ic-hamburger-arrow',
  arrowDown = 'ic-select-arr-down',
  notice = 'notice',
  categorization = 'ic-categorization'
}

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {

  get sideBarOpened(): boolean {
    return this.componentService.showSideMenu;
  }
  icon = Icon;

  constructor(private componentService: ComponentService) {
  }

  toggleSideBar(): void {
    this.componentService.showSideMenu = !this.componentService.showSideMenu;
    this.componentService.onSideBarToggle.next(this.componentService.showSideMenu);
  }
}
