import { Injectable } from '@angular/core';
import { NotificationsService, ToasterType } from '@appcore';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private notificationsService: NotificationsService
  ) { }

  download(url: string): void {
    this.notificationsService.addNotification({
      name: 'download',
      type: ToasterType.info,
      showInToaster: true
    });
  }
}
