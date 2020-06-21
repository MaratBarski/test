import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationsService, INotification, NotificationStatus, ToasterType } from '@appcore';

export class UploadInfo {
  url: string;
  form: FormData;
  notification: INotification;
  targetComponent?: any;
  method?: 'post' | 'put';
}

@Injectable({
  providedIn: 'root'
})
export class UploadService implements OnDestroy {
  get uploads(): Array<UploadInfo> { return this._uploads; }
  private _uploads: Array<UploadInfo> = [];
  private _onAbortSubscribtion: any;
  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {
    this._onAbortSubscribtion = this.notificationsService.onAbort.subscribe((notice: INotification) => {
      this._uploads.forEach((item, index) => {
        if (item.notification === notice) {
          this.uploadEnd(item, NotificationStatus.aborted);
          return;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._onAbortSubscribtion.unsubscribe();
  }

  add(uploadInfo: UploadInfo): void {
    //TO DO remove this line
    uploadInfo.notification.showInContainer = false;

    this._uploads.push(uploadInfo);
    this.notificationsService.notifications.push(uploadInfo.notification);
    this.notificationsService.update();
    this.uploadProc(uploadInfo);
  }

  private uploadProc(uploadInfo: UploadInfo): void {
    if (!this.isUploadEnable(uploadInfo)) { return; }
    const method: 'post' | 'put' = uploadInfo.method ? uploadInfo.method : 'post';
    uploadInfo.notification.status = NotificationStatus.uploading;
    const uploadSubscription = this.http[method](uploadInfo.url, uploadInfo.form, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type == HttpEventType.UploadProgress) {
          uploadInfo.notification.progress = Math.round(events.loaded / events.total * 100);
          if (!this.isUploadEnable(uploadInfo)) {
            if (!uploadSubscription.closed) {
              uploadSubscription.unsubscribe();
            }
          }
        } else if (events.type === HttpEventType.Response) {
          this.uploadEnd(uploadInfo, NotificationStatus.completed);
          if (!uploadSubscription.closed) {
            uploadSubscription.unsubscribe();
          }
        }
      }
        , error => {
          this.uploadEnd(uploadInfo, NotificationStatus.failed);
          console.log(error);
          uploadInfo.notification.name = uploadInfo.notification.failName;
          if (!uploadSubscription.closed) {
            uploadSubscription.unsubscribe();
          }
        }
      )
  }

  private isUploadEnable(uploadInfo: UploadInfo): boolean {
    if (!uploadInfo.notification) { return false; }
    if (!uploadInfo.url) { return false; }
    if (!uploadInfo.form) { return false; }
    if (uploadInfo.notification.status === NotificationStatus.failed) { return false; }
    if (uploadInfo.notification.status === NotificationStatus.aborted) { return false; }
    if (uploadInfo.notification.status === NotificationStatus.completed) { return false; }
    return true;
  }

  private uploadEnd(uploadInfo: UploadInfo, status: NotificationStatus): void {
    uploadInfo.notification.status = status;
    if (status === NotificationStatus.completed
      && uploadInfo.targetComponent
      && uploadInfo.targetComponent.onComplete) {
      uploadInfo.notification.type = ToasterType.success;
      uploadInfo.notification.name = uploadInfo.notification.succName;
      uploadInfo.targetComponent.onComplete();
      uploadInfo.form = undefined;
    }
  }
}