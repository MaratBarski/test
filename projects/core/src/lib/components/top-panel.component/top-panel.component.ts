import {Component, Input} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {ComponentService} from '../../services/component.service';

enum Icon {
  hamburgerOpen = 'ic-hamburger',
  hamburgerClose = 'ic-hamburger-arrow',
  arrowDown = 'ic-select-arr-down',
}

@Component({
  selector: 'mdc-top-panel',
  templateUrl: './top-panel.component.html',
})
export class TopPanelComponent {
  /*@Input() path: string;
  @Input() css;
  @Input() color: string;*/
  sideBarOpened: boolean = false;
  icon = Icon;

  constructor(private componentService: ComponentService) {

  }

  toggleSideBar(): void {
    this.sideBarOpened = this.sideBarOpened ? false : true;

    this.componentService.onSideBarToggle.next(this.sideBarOpened);
  }

}
