import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  static setObject(key: string, value: any): void {
    LocalStorageService.setString(key, JSON.stringify(value));
  }

  static getObject(key: string, defaultValue: any = undefined): any {
    if (localStorage[key] === undefined) {
      LocalStorageService.setObject(key, defaultValue);
    }
    return JSON.parse(localStorage[key]);
  }

  static setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getString(key: string, defaultValue: string = undefined): void {
    if (localStorage[key] === undefined) {
      LocalStorageService.setString(key, defaultValue);
    }
    return localStorage[key];
  }

  static clear(): void { localStorage.clear(); }

  static remove(key: string): void { localStorage.removeItem(key); }
}
