import { Component, Input } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({ marginLeft: '0px' })),
      state('closed', style({ marginLeft: '-250px' })),
      transition('open => closed', [animate('.3s')]),
      transition('closed => open', [animate('.3s')])
    ]),
  ],
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {

  @Input() organizationName = '';
  @Input() logo = '';
  showMenu = false;
  showProfile = false;

  constructor(public componentService: ComponentService) { }

  displaySideMenu(): void {
    this.componentService.showSideMenu = !this.componentService.showSideMenu
  }
}
