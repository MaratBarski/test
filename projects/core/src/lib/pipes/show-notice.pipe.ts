import { Pipe, PipeTransform } from '@angular/core';
import { INotification } from '../services/notifications.service';

@Pipe({
  name: 'showNotice'
})
export class ShowNoticePipe implements PipeTransform {

  transform(notifications: Array<INotification>, showType: 'container' | 'toaster'): any {
    if (!showType || showType === 'container') {
      return notifications.filter(x => { return x.showInContainer }).reverse();
    }
    return notifications.filter(x => { return x.showInToaster }).reverse();
  }

}
