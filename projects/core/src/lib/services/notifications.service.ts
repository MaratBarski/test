import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { NavigationService } from './navigation.service';
import { HttpClient } from '@angular/common/http';
import { BaseSibscriber } from '../common/BaseSibscriber';
import { ENV } from '../config/env';

export enum ToasterType {
  info,
  error,
  warning,
  success,
  infoProgressBar
}

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
  abortComment?: string;
  comment?: string;
  succComment?: string;
  startDate?: Date;
  progress?: number;
  progressKf?: number;
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
  containerEnable?: boolean;
  isClientOnly?: boolean;
  removeOnComplete?: boolean;
  abortDisabled?: boolean;
  displayPeriod?: number;
  responseDisplayPeriod?: number;
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
  { client: 'type', server: 'type' },
  { client: 'progressTitle', server: 'progressTitle' },
  { client: 'displayPeriod', server: 'displayPeriod' }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseSibscriber {

  closeMessage(notice: INotification) {
    notice.showInToaster = false;
    notice.showInContainer = !!notice.containerEnable;
    this.update();
    if (notice.showInContainer) {
      this._onNotificationAdded.next();
    }
  }

  get onNotificationAdded(): Observable<any> {
    return this._onNotificationAdded.asObservable();
  }
  private _onNotificationAdded = new Subject();

  get onResponse(): Observable<INotification> {
    return this._onResponse.asObservable();
  }
  private _onResponse = new Subject<INotification>()

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

  getFormKey(): Promise<any> {
    return this.http.get(`${ENV.serverUrl}${ENV.endPoints.formKey}`).toPromise();
  }

  dismissAll(): void {
    //this._onDismissAll.next();
    this.notifications.forEach(x => {
      x.showInContainer = false;
      setTimeout(() => {
        this.sendNotification(x);
      }, 0);
    });
    this.update();
  }

  update(): void {
    this._notifications = [...this.notifications];
  }

  get sendNotificationUrl(): string {
    return `${ENV.serverUrl}${ENV.endPoints.notificationUpdate}`;
  }

  private submitNotification(notice: INotification): void {
    const serverNotice = this.createServerNotification(notice);
    //alert(notice.key)
    super.add(
      this.http.post(this.sendNotificationUrl, serverNotice).subscribe(() => {
      }, error => {
      }));
  }

  sendNotification(notice: INotification): void {
    //console.log(JSON.stringify(serverNotice))
    if (notice.isClientOnly) { return; }
    if (!notice.key) {
      this.getFormKey().then(key => {
        notice.key = key.data.guid;
        this.submitNotification(notice);
      }).catch(error => {
      });
      return;
    }
    this.submitNotification(notice);
  }

  abort(notice: INotification): void {
    notice.type = ToasterType.success;
    notice.name = notice.abortName;
    notice.comment = notice.abortComment;
    notice.status = NotificationStatus.aborted;
    notice.isAborted = true;
    this._onAbort.next(notice);
    this.update();
    this.sendNotification(notice);
  }

  addNotification(notice: INotification): void {
    notice.showInContainer = false;
    notice.containerEnable = true;
    notice.showInToaster = true;
    this.notifications.push(notice);
    this.update();
    this.sendNotification(notice);
  }

  serverUpdate(data: any): void {
    if (!data) { return; }
    if (!data.length) { data = [data]; }
    const missingNotice = [];
    data.forEach((serverNotice: any) => {
      let clientNotice = this.notifications.find(x => x.key && x.key === serverNotice.key);
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
      if (clientNotice.status === NotificationStatus.completed || clientNotice.status === NotificationStatus.failed) {
          this._onResponse.next(clientNotice);
      }
    });
    this._notifications = this.notifications.concat(missingNotice);
  }

  copyNotification(from: any, to: INotification): void {
    if (from.showInContainer) {
      this._onNotificationAdded.next();
    }
    NOTIFICATION_MAP.forEach(k => {
      if (k.client === 'progress') {
        to[k.client] = Math.max(to[k.client] || 0, from[k.server] || 0);
      } else {
        to[k.client] = from[k.server];
      }
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

  isAbortDisabled(notice: INotification): boolean {
    return (notice && notice.progress >= 50);
  }
}
