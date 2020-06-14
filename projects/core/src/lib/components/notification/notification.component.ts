import {Component, Input, EventEmitter, Output, forwardRef} from '@angular/core';
import {animation} from '../../animations/animations';
import {IToasterNotification, NotificationsService} from '../../services/notifications.service';

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
  list: IToasterNotification[] = [];
  preDelete = {};

  constructor(private notificationsService: NotificationsService) {
    this.notificationsService.onToasterContainerChanged.subscribe(data => {
      this.list = data;
    });
  }

  onClose(id: string) {
    this.preDelete[id] = true;
    this.close(id);
  }

  close(id){
    setTimeout(() => {
      this.notificationsService.closeMessage(id);
    }, 1000);
  }
}
