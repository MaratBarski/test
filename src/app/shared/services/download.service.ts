import { Injectable } from '@angular/core';
import { NotificationsService, ToasterType, INotification } from '@appcore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private notificationsService: NotificationsService,
    private http: HttpClient
  ) { }

  download(url: string): void {
    const notice: INotification = {
      name: 'Download',
      type: ToasterType.info,
      comment: url,
      showInToaster: true
    }
    this.notificationsService.addNotification(notice);
    this.http.get(url, { responseType: 'blob' })
      .subscribe((res: any) => {
        notice.type = ToasterType.success;
        notice.comment = 'Download success';
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        //a.setAttribute('target', '_blank');
        a.href = url;
        a.download = res.filename;
        a.click();
        a.remove();
      }, (error: any) => {
        //alert(JSON.stringify(error));
        notice.type = ToasterType.error;
        notice.comment = `Download failed on ${url}`;
      });
  }
}
