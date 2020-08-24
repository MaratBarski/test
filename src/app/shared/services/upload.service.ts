import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationsService, INotification, NotificationStatus, ToasterType } from '@appcore';
import { ConfigService } from './config.service';

export class UploadInfo {
  url: string;
  form: FormData;
  notification: INotification;
  targetComponent?: any;
  method?: 'post' | 'put';
  afterUpload?: any;
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
    private notificationsService: NotificationsService,
    private configService: ConfigService
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

  addWithKey(uploadInfo: UploadInfo): void {
    this.configService.getFormKey().then(key => {
      uploadInfo.form.append('key', key.data.guid);
      uploadInfo.notification.key = key.data.guid;
      this.add(uploadInfo);
    }).catch(er => {
    });
  }

  add(uploadInfo: UploadInfo): void {
    uploadInfo.notification.containerEnable = true;
    uploadInfo.notification.showInToaster = true;
    this._uploads.push(uploadInfo);
    this.notificationsService.addNotification(uploadInfo.notification);
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
          let progressKf = uploadInfo.notification.progressKf || 1;
          if (progressKf <= 0) { progressKf = 1; }
          uploadInfo.notification.progress = Math.round(events.loaded / events.total * 100) / progressKf;
          if (!this.isUploadEnable(uploadInfo)) {
            if (!uploadSubscription.closed) {
              uploadSubscription.unsubscribe();
            }
          }
        } else if (events.type === HttpEventType.Response) {
          this.uploadEnd(uploadInfo, NotificationStatus.completed);
          uploadInfo.notification.comment = uploadInfo.notification.succComment;
          uploadInfo.afterUpload(events.body, uploadInfo);
          if (!uploadSubscription.closed) {
            uploadSubscription.unsubscribe();
          }
        }
      }
        , error => {
          if (uploadInfo.targetComponent && uploadInfo.targetComponent.onComplete) {
            uploadInfo.targetComponent.onComplete();
          }
          this.uploadEnd(uploadInfo, NotificationStatus.failed);
          console.log(error);
          if (uploadInfo.notification.status !== NotificationStatus.aborted) {
            uploadInfo.notification.name = uploadInfo.notification.failName;
            if (uploadInfo.notification.failComment) {
              uploadInfo.notification.comment = uploadInfo.notification.failComment;
            }
            uploadInfo.notification.type = ToasterType.error;
            uploadInfo.notification.errorMessage = error.error ? (error.error.massage || error.error.message || '') : '';
          }
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
    if (uploadInfo.notification.status !== NotificationStatus.aborted) {
      uploadInfo.notification.status = status;
    }
    if (status === NotificationStatus.completed) {
      uploadInfo.notification.type = ToasterType.success;
      uploadInfo.notification.name = uploadInfo.notification.succName;
    }
    if (status === NotificationStatus.completed
      && uploadInfo.targetComponent
      && uploadInfo.targetComponent.onComplete) {
      uploadInfo.targetComponent.onComplete();
    }
    uploadInfo.form = undefined;
  }
}
