import { Component, Input, EventEmitter, Output } from '@angular/core';
import { animation } from '../../animations/animations';
import { INotification } from '../../services/notifications.service';

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
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class ToasterComponent {
  @Input() notice: INotification;

  // emitting close event with id of toaster for searching in array of toasters;
  @Output() onToasterClose: EventEmitter<INotification> = new EventEmitter<INotification>();

  @Output() onAbort: EventEmitter<INotification> = new EventEmitter<INotification>();
  toasterType = ToasterType;

  onCloseClicked(): void {
    this.onToasterClose.emit(this.notice);
  }

  onAbortClicked(): void {
    console.log('abort');
    this.onAbort.emit(this.notice);
  }
}
