import {Component, Input} from '@angular/core';
import { ComponentService } from '../../services/component.service';
// import {environment} from '@env/environment';

export enum Icon {
  hamburgerOpen = 'ic-hamburger',
  hamburgerClose = 'ic-hamburger-arrow',
  arrowDown = 'ic-select-arr-down',
  notice = 'notice',
  categorization = 'ic-categorization',
  numeric = 'ic-numeric',
  textual = 'ic-textual',
  date = 'ic-calendar'
}

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {
  //  = environment.serverRoute;
  @Input() uiRoute;
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
