import { Injectable } from '@angular/core';
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
export class UploadService {
  get uploads(): Array<UploadInfo> { return this._uploads; }
  private _intervalID: any;
  private _uploads: Array<UploadInfo> = [];
  constructor() {
    this.startUpload();
  }

  add(uploadInfo: UploadInfo): void {
    this._uploads.push(uploadInfo);
  }

  private startUpload(): void {
    this._intervalID = setInterval(() => {
      if (this._uploads.length) {

      }
    }, 100);
  }
}

// this.http.post('url/to/your/api', formData, {
//   reportProgress: true,
//   observe: 'events'
// }).subscribe(events => {
//   if (events.type == HttpEventType.UploadProgress) {
//     console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
//   } else if (events.type === HttpEventType.Response) {
//     console.log(events);
//   }
// })