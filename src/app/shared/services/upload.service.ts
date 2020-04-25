import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationsService, INotification, NotificationStatus } from '@appcore';

export class UploadInfo {
  url: string;
  form: FormData;
  notification: INotification;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService implements OnDestroy {
  get uploads(): Array<UploadInfo> { return this._uploads; }
  private _intervalID: any;
  private _uploads: Array<UploadInfo> = [];
  private _uploading = false;
  private _onDismissAllSubscribtion: any;
  private _onAbortSubscribtion: any;
  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {
    this.startUpload();
    this._onDismissAllSubscribtion = this.notificationsService.onDismissAll.subscribe(() => {
      while (this._uploads.length) {
        this.removeFirst(NotificationStatus.dismissed);
      }
    });
    this._onAbortSubscribtion = this.notificationsService.onAbort.subscribe((notice: INotification) => {
      this._uploads.forEach((item, index) => {
        if (item.notification === notice) {
          this.remove(index, NotificationStatus.aborted)
          return;
        }
      });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this._intervalID);
    this._onDismissAllSubscribtion.unsubscribe();
    this._onAbortSubscribtion.unsubscribe();
  }

  add(uploadInfo: UploadInfo): void {
    this._uploads.push(uploadInfo);
    this.notificationsService.notifications.push(uploadInfo.notification);
    this.notificationsService.update();
  }

  private upload(): void {
    if (!this._uploads.length) { return; }
    if (this._uploading) { return; }

    this._uploading = true;
    this._uploads[0].notification.status = NotificationStatus.uploading;
    this.http.post(this._uploads[0].url, this._uploads[0].form, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (!this._uploads.length) { this._uploading = false; return; }
        if (events.type == HttpEventType.UploadProgress) {
          this._uploads[0].notification.progress = Math.round(events.loaded / events.total * 100);
        } else if (events.type === HttpEventType.Response) {
          this.removeFirst(NotificationStatus.completed);
          this._uploading = false;
        }
      }
        , error => {
          this.removeFirst(NotificationStatus.failed);
          console.log(error);
          this._uploading = false;
        }
      )
  }

  private removeFirst(status: NotificationStatus): void {
    this.remove(0, status);
  }

  private remove(index: number, status: NotificationStatus): void {
    if (this._uploads.length <= index) { return; }
    this._uploads[index].notification.status = status;
    this._uploads.splice(index, 1);
    //this.notificationsService.notifications.splice(0, 1);
  }

  private startUpload(): void {
    this._intervalID = setInterval(() => {
      this.upload();
    }, 1000);
  }
}