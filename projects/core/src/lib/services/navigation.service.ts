import { Injectable } from '@angular/core';
import { SideMenu } from '../common/side-menu';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private loginService: LoginService) {
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
  get onReload(): Observable<any> {
    return this._onReload.asObservable();
  }
  private _onNavigationStart = new Subject<string>();
  private _onNavigationEnd = new Subject();
  private _onReload = new Subject();

  set currentPageID(currentPageID: string) {
    this.loginService.checkPermission(currentPageID);
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

  reload(): void {
    this._onReload.next();
  }

}
