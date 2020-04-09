import { Component } from '@angular/core';
import { ComponentService } from '../../services/component.service';

enum Icon {
  hamburgerOpen = 'ic-hamburger',
  hamburgerClose = 'ic-hamburger-arrow',
  arrowDown = 'ic-select-arr-down',
}

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {

  sideBarOpened: boolean = false;
  icon = Icon;

  constructor(private componentService: ComponentService) {

  }

  toggleSideBar(): void {
    this.sideBarOpened = this.sideBarOpened ? false : true;

    this.componentService.onSideBarToggle.next(this.sideBarOpened);
  }
}
