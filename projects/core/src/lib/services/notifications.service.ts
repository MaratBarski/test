import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationStatus {
  uploading = 'Uploading',
  failed = 'Failed',
  completed = 'Completed',
  dismissed = 'Dismissed',
  aborted = 'Aborted'
}
export interface INotification {
  name: string;
  comment: string;
  startDate: Date;
  progress: number;
  status: NotificationStatus;
  showProgress: boolean;
  showInContainer: boolean;
  progressTitle?: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

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

  constructor() { }

  dismissAll(): void {
    //this._onDismissAll.next();
    this.notifications.forEach(x => x.showInContainer = false);
    this.update();
  }

  update(): void {
    this._notifications = [...this.notifications];
  }

  abort(notice: INotification): void {
    this._onAbort.next(notice);
  }
}
