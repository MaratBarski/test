import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ToasterType } from '../components/toaster/toaster.component';

export enum NotificationStatus {
  uploading = 'Uploading',
  failed = 'Failed',
  completed = 'Completed',
  aborted = 'Aborted',
  waiting = 'Waiting',
  dismissed = 'Dismissed'
}

export interface INotification {
  name: string;
  failName?: string;
  succName?: string;
  abortName?: string;
  comment?: string;
  startDate?: Date;
  progress?: number;
  status?: NotificationStatus;
  showProgress?: boolean;
  showInContainer?: boolean;
  showInToaster?: boolean;
  type: ToasterType;
  fileName?: string;
  errorMessage?: string;
  progressTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  warningRoutingMessage = undefined;

  closeMessage(notice: INotification) {
    notice.showInToaster = false;
    this.update();
  }

  get notifications(): Array<INotification> {
    return this._notifications;
  }

  private _notifications: Array<INotification> = [];

  get onDismissAll(): Observable<void> {
    return this._onDismissAll;
  }

  private _onDismissAll = new Subject<void>();

  get onAbort(): Observable<INotification> {
    return this._onAbort;
  }

  private _onAbort = new Subject<INotification>();

  get uploadingCount(): number {
    return this.notifications.filter(x => x.status === NotificationStatus.uploading).length;
  }

  constructor() {
    window.addEventListener('beforeunload', (event) => {
      if (!this.uploadingCount) {
        return;
      }
      event.preventDefault();
      event.returnValue = 'Your notifications will be lost!';
      return event;
    });
  }

  dismissAll(): void {
    //this._onDismissAll.next();
    this.notifications.forEach(x => x.showInContainer = false);
    this.update();
  }

  update(): void {
    this._notifications = [...this.notifications];
  }

  abort(notice: INotification): void {
    notice.type = ToasterType.error;
    notice.name = notice.abortName;
    this._onAbort.next(notice);
    this.update();
  }

  addNotification(notice: INotification): void {
    this.notifications.push(notice);
    this.update();
  }
}
