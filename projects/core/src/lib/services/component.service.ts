import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  showSideMenu = true;

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
      element.getBoundingClientRect()
  }
}
