import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { animation } from '../../animations/animations';
import { NotificationsService, INotification } from '../../services/notifications.service';

// export enum RotateAnimationState {
//   initState = 'default',
//   rotate = 'rotated'
// }

@Component({
  selector: 'mdc-notification',
  templateUrl: './notification.component.html',
  animations: [
    animation.rotateRight90,
    animation.slideUpDown,
    animation.slideLeft,
  ],
})
export class NotificationComponent {

  @Output() onStateChange = new EventEmitter<boolean>();

  constructor(public notificationsService: NotificationsService) { }

  onClose(notice: INotification): void {
    this.notificationsService.closeMessage(notice);
  }

  onAbort(notice: INotification): void {
    this.notificationsService.abort(notice);
  }

}
