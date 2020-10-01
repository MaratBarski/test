import { Component, Input, HostListener } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { NotificationsService } from '../../services/notifications.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BaseSibscriber } from '../../common/BaseSibscriber';

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
export class MainHeaderComponent extends BaseSibscriber {
  @Input() uiRoute;
  get sideBarOpened(): boolean {
    return this.componentService.showSideMenu;
  }
  icon = Icon;
  rotateTimeoutID: any;

  constructor(
    private componentService: ComponentService,
    public notificationsService: NotificationsService
  ) {
    super();
    super.add(
      this.notificationsService.onNotificationAdded.subscribe(() => {
        this.clearRotateTimeout();
        this.noticeRotate(10);
      })
    );
  }

  newCss = '';

  clearRotateTimeout(): void {
    if (this.rotateTimeoutID) {
      clearTimeout(this.rotateTimeoutID);
    }
    this.rotateTimeoutID = undefined;
  }

  noticeRotate(count: number): void {
    this.clearRotateTimeout();
    if (count <= 0) { this.newCss = ''; return; }
    this.newCss = !this.newCss || this.newCss === 'r0' ? 'r1' : 'r0';
    this.rotateTimeoutID = setTimeout(() => {
      this.noticeRotate(count - 1);
    }, 100);
  }

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
    //this.testNotice();
  }

  toggleSideBar(): void {
    this.componentService.showSideMenu = !this.componentService.showSideMenu;
    this.componentService.onSideBarToggle.next(this.componentService.showSideMenu);
  }

  testNotice(): void {
    //setInterval(() => {
      this.notificationsService.addServerNotification({
        key: "ee0e3204-0a84-4042-b3e9-4affb5566a78",
        message: "Comments",
        showInToaster: false,
        showInContainer: true,
        status: "Failed",
        subject: "File mapping saved successfully↵",
        succLinkText: "link to page",
        type: 3
      });
    //}, 1000);
  }
}
