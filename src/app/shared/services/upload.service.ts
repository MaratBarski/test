import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

export enum UploadStatus {
  progress = 1,
  error = 2,
  success = 3,
  waiting = 4,
  pause = 5
}
export class UploadInfo {
  title?: string;
  url: string;
  form: FormData;
  status?: UploadStatus;
  progress?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService implements OnDestroy {
  get uploads(): Array<UploadInfo> { return this._uploads; }
  private _intervalID: any;
  private _uploads: Array<UploadInfo> = [];
  constructor(
    private http: HttpClient
  ) {
    this.startUpload();
  }

  ngOnDestroy(): void {
    clearInterval(this._intervalID);
  }

  add(uploadInfo: UploadInfo): void {
    this._uploads.push(uploadInfo);
  }

  private startUpload(): void {
    this._intervalID = setInterval(() => {
      if (this._uploads.length) {
        this.http.post(this._uploads[0].url, this._uploads[0].form, {
          reportProgress: true,
          observe: 'events'
        }).subscribe(events => {
          if (events.type == HttpEventType.UploadProgress) {
            this._uploads[0].status = Math.round(events.loaded / events.total * 100);
            console.log('Upload progress: ', this._uploads[0].status + '%');
          } else if (events.type === HttpEventType.Response) {
            this._uploads.splice(0, 1)
            console.log(events);
          }
        })
      }
    }, 1000);
  }
}