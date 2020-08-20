import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ToasterType } from '../components/toaster/toaster.component';
import { NavigationService } from './navigation.service';
import { HttpClient } from '@angular/common/http';
import { BaseSibscriber } from '../common/BaseSibscriber';
import { ENV } from '../config/env';

export enum NotificationStatus {
  uploading = 'Uploading',
  failed = 'Failed',
  completed = 'Completed',
  aborted = 'Aborted',
  waiting = 'Waiting',
  dismissed = 'Dismissed'
}

export interface INotification {
  key?: string;
  name?: string;
  failName?: string;
  failComment?: string;
  succName?: string;
  abortName?: string;
  comment?: string;
  succComment?: string;
  startDate?: Date;
  progress?: number;
  status?: NotificationStatus;
  showProgress?: boolean;
  showInContainer?: boolean;
  showInToaster?: boolean;
  type?: ToasterType;
  fileName?: string;
  errorMessage?: string;
  progressTitle?: string;
  succUrl?: string;
  succLinkText?: string;
  link?: string;
  onComplete?: any;
  onError?: any;
  onProgress?: any;
  isAborted?: boolean;
}

const NOTIFICATION_MAP: Array<{ client: string, server: string }> = [
  { client: 'name', server: 'subject' },
  { client: 'progress', server: 'progress' },
  { client: 'comment', server: 'message' },
  { client: 'status', server: 'status' },
  { client: 'showInToaster', server: 'showInToaster' },
  { client: 'showInContainer', server: 'showInContainer' },
  { client: 'link', server: 'link' },
  { client: 'key', server: 'key' },
  { client: 'startDate', server: 'startDate' },
  { client: 'type', server: 'type' }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseSibscriber {

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

  constructor(
    private navigationService: NavigationService,
    private http: HttpClient
  ) {
    super();
    window.addEventListener('beforeunload', (event) => {
      if (this.uploadingCount ||
        (this.navigationService.beforeNavigate && this.navigationService.beforeNavigate())
      ) {
        event.preventDefault();
        event.returnValue = 'Your notifications will be lost!';
        return event;
      }
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

  get sendNotificationUrl(): string {
    return `${ENV.serverUrl}${ENV.endPoints.notificationUpdate}`;
  }

  sendNotification(notice: INotification): void {
    const serverNotice = this.createServerNotification(notice);
    //console.log(JSON.stringify(serverNotice))
    super.add(
      this.http.post(this.sendNotificationUrl, serverNotice).subscribe(() => {

      }, error => {

      }));
  }

  abort(notice: INotification): void {
    notice.type = ToasterType.error;
    notice.name = notice.abortName;
    notice.isAborted = true;
    this._onAbort.next(notice);
    this.update();
    this.sendNotification(notice);
  }

  addNotification(notice: INotification): void {
    notice.showInContainer = true;
    notice.showInToaster = true;
    this.notifications.push(notice);
    this.update();
  }

  serverUpdate(data: any): void {
    if (!data) { return; }
    if (!data.length) { data = [data]; }
    const missingNotice = [];
    data.forEach((serverNotice: any) => {
      let clientNotice = this.notifications.find(x => x.key === serverNotice.key);
      if (!clientNotice) {
        clientNotice = {};
        this.copyNotification(serverNotice, clientNotice);
        missingNotice.push(clientNotice);
        return;
      }
      this.copyNotification(serverNotice, clientNotice);
      if (clientNotice.status === NotificationStatus.completed && clientNotice.onComplete) {
        clientNotice.onComplete();
        clientNotice.onComplete = undefined;
      }
    });
    this._notifications = this.notifications.concat(missingNotice);
  }

  copyNotification(from: any, to: INotification): void {
    NOTIFICATION_MAP.forEach(k => {
      to[k.client] = from[k.server];
    });
  }

  createServerNotification(notice: INotification): any {
    const res: any = {};
    NOTIFICATION_MAP.forEach(k => {
      res[k.server] = notice[k.client];
    });
    res.isAborted = notice.isAborted;
    return res;
  }

  addServerNotification(notice: any): void {
    const n = {}
    this.copyNotification(notice, n);
    this._notifications = this._notifications.concat([n]);
  }
}
