import { Pipe, PipeTransform } from '@angular/core';
import { INotification } from '../services/notifications.service';

@Pipe({
  name: 'showNotice'
})
export class ShowNoticePipe implements PipeTransform {

  transform(notifications: Array<INotification>): any {
    return notifications.filter(x => { return x.showInContainer }).reverse();
  }

}
