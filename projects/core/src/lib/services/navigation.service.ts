import { Injectable } from '@angular/core';
import { SideMenu } from '../common/side-menu';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  set currentPageID(currentPageID: string) {
    SideMenu.filter(x => x.active).forEach(x => x.active = false);
    SideMenu.filter(x => x.id === currentPageID).forEach(x => x.active = true);
  }

  beforeNavigate: any;

  navigate(url: string): void {
    if (this.beforeNavigate) {
      this.beforeNavigate(url);
      return;
    }
    this.router.navigateByUrl(url);
  }

}
