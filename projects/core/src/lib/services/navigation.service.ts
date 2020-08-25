import { Injectable } from '@angular/core';
import { SideMenu } from '../common/side-menu';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        this.afterNavigate();
      }

      if (event instanceof NavigationError) {
        this.afterNavigate();
      }
    });
  }

  get onNavigationStart(): Observable<string> {
    return this._onNavigationStart.asObservable();
  }
  get onNavigationEnd(): Observable<any> {
    return this._onNavigationEnd.asObservable();
  }

  private _onNavigationStart = new Subject<string>();
  private _onNavigationEnd = new Subject();

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
    this._onNavigationStart.next(url);
  }

  afterNavigate(): void {
    this._onNavigationEnd.next();
  }

}
