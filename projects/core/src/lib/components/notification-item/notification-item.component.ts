import { Component, Input } from '@angular/core';
import { INotification, NotificationStatus, NotificationsService } from '../../services/notifications.service';

enum Icon {
  hamburgerOpen = 'ic-hamburger',
  hamburgerClose = 'ic-hamburger-arrow',
  arrowDown = 'ic-select-arr-down',
  notice = 'notice',
  categorization = 'ic-categorization'
}
@Component({
  selector: 'mdc-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent {

  icon = Icon;
  status = NotificationStatus;
  @Input() notice: INotification;

  constructor(
    private notificationsService: NotificationsService
  ) { }

  showProgress(): void {
    this.notice.showProgress = !this.notice.showProgress;
  }

  closeNotice(): void {
    this.notice.showInContainer = false;
    this.notificationsService.update();
  }

  abort():void{
    this.notificationsService.abort(this.notice)
  }
}