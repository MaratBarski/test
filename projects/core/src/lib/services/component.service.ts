import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

const SUB_MENU_SHOW = 'showSideMenu';
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  set showSideMenu(showSideMenu: boolean) {
    localStorage.setItem(SUB_MENU_SHOW, showSideMenu.toString().toLowerCase());
  }

  get showSideMenu(): boolean {
    if (localStorage.getItem(SUB_MENU_SHOW) !== 'true' && localStorage.getItem(SUB_MENU_SHOW) !== 'false') {
      this.showSideMenu = true;
    }
    return localStorage.getItem(SUB_MENU_SHOW) === 'true';
  }

  get onToggleMenu(): Observable<boolean> {
    return this._onToggleMenu.asObservable();
  }
  private _onToggleMenu = new BehaviorSubject<boolean>(true);

  get onStartToggleMenu(): Observable<boolean> {
    return this._onStartToggleMenu.asObservable();
  }
  private _onStartToggleMenu = new Subject<boolean>();

  toggleMenu(): void {
    setTimeout(() => {
      document.body.style.overflow = 'visible';
    }, 500);
    this._onToggleMenu.next(this.showSideMenu);
  }

  getFileName(path: string): string {
    if (!path) { return ''; }
    const arr = path.replace(/\\/g, '/').split('/');
    return arr[arr.length - 1];
  }

  starttoggle(): void {
    document.body.style.overflow = 'hidden';
    this._onStartToggleMenu.next(this.showSideMenu);
  }

  static createID(prefix: string = 'id'): string {
    return `${prefix}_${Math.random().toString().replace('.', '')}`;
  }

  static scrollTop(): number {
    return document.body.scrollTop || document.documentElement.scrollTop;
  }

  static resetScroll(): void {
    ComponentService.scrollTo(0, 0);
  }

  static scrollTo(x: number, y: number): void {
    window.scrollTo(x, y);
  }

  static getRect(element: any): any {
    return element.nativeElement ?
      element.nativeElement.getBoundingClientRect() :
      element.getBoundingClientRect();
  }
}
