import { Component, Input, EventEmitter, Output } from '@angular/core';
import { animation } from '../../animations/animations';
import { INotification, NotificationStatus, NotificationsService } from '../../services/notifications.service';
import { NavigationService } from '../../services/navigation.service';

export enum ToasterType {
  info,
  error,
  warning,
  success,
  infoProgressBar
}

@Component({
  selector: 'mdc-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class ToasterComponent {

  constructor(
    private navigationService: NavigationService,
    private notificationsService: NotificationsService
  ) { }

  @Input() notice: INotification;

  // emitting close event with id of toaster for searching in array of toasters;
  @Output() onToasterClose: EventEmitter<INotification> = new EventEmitter<INotification>();

  @Output() onAbort: EventEmitter<INotification> = new EventEmitter<INotification>();
  toasterType = ToasterType;

  onCloseClicked(): void {
    this.notice.showInToaster = false;
    this.onToasterClose.emit(this.notice);
    this.notificationsService.sendNotification(this.notice);
  }

  get isAbortDisabled(): boolean {
    return this.notificationsService.isAbortDisabled(this.notice);
  }

  onAbortClicked(): void {
    if (this.isAbortDisabled) { return; }
    this.onAbort.emit(this.notice);
  }

  navigate(): void {
    this.onCloseClicked();
    this.navigationService.navigate(this.notice.succUrl);
  }
}
