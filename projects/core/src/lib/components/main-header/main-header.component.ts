import { Component, Input, HostListener } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { NotificationsService } from '../../services/notifications.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  styleUrls: ['./main-header.component.css'],
  animations: [
    trigger('toggleHeight', [
      state('false', style({
        height: '0px',
        opacity: '0',
        overflow: 'hidden'
        // display: 'none'
      })),
      state('true', style({
        height: '*',
        opacity: '1'
      })),
      transition('true => false', animate('200ms ease-in')),
      transition('false => true', animate('200ms ease-out'))
    ])
  ],
})
export class MainHeaderComponent {
  //  = environment.serverRoute;
  @Input() uiRoute;
  get sideBarOpened(): boolean {
    return this.componentService.showSideMenu;
  }
  icon = Icon;

  constructor(
    private componentService: ComponentService,
    public notificationsService: NotificationsService
  ) { }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isNoticeOver) { return; }
    this.isShowNotifications = false;
  }

  isNoticeOver = false;

  noticeClick(event: any): void {

  }

  isShowNotifications = false;

  showNotifications(event): void {
    const isSshow = this.isShowNotifications;
    ComponentService.documentClick(event);
    this.isShowNotifications = !isSshow;
  }

  toggleSideBar(): void {
    this.componentService.showSideMenu = !this.componentService.showSideMenu;
    this.componentService.onSideBarToggle.next(this.componentService.showSideMenu);
  }
}
