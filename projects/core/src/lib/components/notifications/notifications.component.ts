import { Component } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';


@Component({
  selector: 'mdc-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  constructor(
    public notificationsService: NotificationsService
  ) { }

  dismissAll(): void {
    this.notificationsService.dismissAll();
  }

}
