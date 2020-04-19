import { Injectable } from '@angular/core';
import { SideMenu } from '../common/side-menu';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  set currentPageID(currentPageID: string) {
    SideMenu.filter(x => x.active).forEach(x => x.active = false);
    SideMenu.filter(x => x.id === currentPageID).forEach(x => x.active = true);
  }

}
