import { Injectable } from '@angular/core';
import { NotificationsService, ToasterType } from '@appcore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private notificationsService: NotificationsService,
    private http: HttpClient
  ) { }

  saveAsBlob(data: Response) {
    // var blob = new Blob([data.blob], { type: 'image/png' });
    // var url= window.URL.createObjectURL(blob);
    // window.open(url);
  }

  download(url: string): void {
    //window.open(url)
    this.http.get(url)
      .subscribe((res: any) => {
        alert(JSON.stringify(res))
        // var newBlob = new Blob([res.body], {});
        // let url = window.URL.createObjectURL(res.data);
        // let a = document.createElement('a');
        // document.body.appendChild(a);
        // a.setAttribute('style', 'display: none');
        // a.href = url;
        // a.download = res.filename;
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();
      });

    this.notificationsService.addNotification({
      name: 'download',
      type: ToasterType.info,
      showInToaster: true
    });
  }
}
