import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { animation } from '../../animations/animations';
import { INotification, NotificationsService, ToasterType } from '../../services/notifications.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'mdc-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class ToasterComponent implements OnInit {

  constructor(
    private navigationService: NavigationService,
    private notificationsService: NotificationsService
  ) {
    notificationsService.onResponse.subscribe((notice: INotification) => {
      if (this.notice === notice) {
        this.notice.displayPeriod = this.notice.responseDisplayPeriod;
        this.closeProc();
      }
    });
  }

  @Input() notice: INotification;

  mouseover(): void {
    if (!this.closeTimeOutID) { return; }
    clearTimeout(this.closeTimeOutID);
    this.closeTimeOutID = undefined;
  }

  mouseleave(): void {
    this.closeProc();
  }

  private closeTimeOutID: any;

  ngOnInit(): void {
    this.closeProc();
  }

  closeProc(): void {
    if (!this.notice.displayPeriod || this.notice.displayPeriod <= 0) { return; }
    this.closeTimeOutID = setTimeout(() => {
      this.onCloseClicked();
    }, 4 * 1000);
  }

  // emitting close event with id of toaster for searching in array of toasters;
  @Output() onToasterClose: EventEmitter<INotification> = new EventEmitter<INotification>();

  @Output() onAbort: EventEmitter<INotification> = new EventEmitter<INotification>();
  toasterType = ToasterType;

  closeNotice(): void {
    this.notice.showInToaster = false;
    this.notice.showInContainer = true;
    this.onToasterClose.emit(this.notice);
    this.notificationsService.sendNotification(this.notice);
  }

  onCloseClicked(): void {
    this.mouseover();
    this.closeNotice();
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
