import {Injectable} from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import {ToasterType} from '../components/toaster/toaster.component';
import {UUID} from 'angular2-uuid';

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
  comment: string;
  startDate: Date;
  progress: number;
  status: NotificationStatus;
  showProgress: boolean;
  showInContainer: boolean;
  progressTitle?: string;
}

export interface IToasterNotification {
  id: string;
  type: ToasterType;
  title: string;
  text: string;
  fileName?: string;
  percentage?: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  toasterNotificationList: any = [];
  onToasterContainerChanged: BehaviorSubject<IToasterNotification[]> = new BehaviorSubject<IToasterNotification[]>([]);

  addMessage(type: ToasterType, title: string, text: string, fileName: string, percentage: number): string {
    const uuid = UUID.UUID();
    const notice: IToasterNotification = {
      id: uuid,
      type,
      title,
      text,
      fileName,
      percentage,
    };
    // this.toasterNotificationList.push(notice);
    this.toasterNotificationList.splice(0, 0, notice)
    this.onToasterContainerChanged.next(this.toasterNotificationList);
    return uuid;
  }

  updateMessage(id: string, type: ToasterType, title: string, text: string, fileName: string, percentage: number) {
    const index = this.toasterNotificationList.findIndex(tn => tn.id === id);
    if (index > -1) {
      this.toasterNotificationList[index].type = type;
      this.toasterNotificationList[index].title = title;
      this.toasterNotificationList[text].title = text;
      this.toasterNotificationList[index].title = title;
      this.toasterNotificationList[fileName].title = fileName;
      this.toasterNotificationList[percentage].title = percentage;
      this.onToasterContainerChanged.next(this.toasterNotificationList);
      return true;
    } else {
      return false;
    }
  }

  closeMessage(id: string) {
    const index = this.toasterNotificationList.findIndex(tn => tn.id === id);
    if (index > -1) {
      this.toasterNotificationList.splice(index, 1);
      this.onToasterContainerChanged.next(this.toasterNotificationList);
      return true;
    } else {
      return false;
    }
  }

  aboardMessage(id: string) {
    const index = this.toasterNotificationList.findIndex(tn => tn.id === id);
    if (index > -1) {
      this.toasterNotificationList.splice(index, 1);
      this.onToasterContainerChanged.next(this.toasterNotificationList);
      return true;
    } else {
      return false;
    }
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
    this._onAbort.next(notice);
  }
}
