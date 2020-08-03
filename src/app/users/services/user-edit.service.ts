import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  constructor() { }

  user = {
    isSuperAdmin: false,
    enabled: true
  }

  environments = [
    { name: 'environment1', id: 1, isChecked: true },
    { name: 'environment2', id: 2, isChecked: false },
    { name: 'environment3', id: 3, isChecked: true },
    { name: 'environment4', id: 4, isChecked: true },
    { name: 'environment5', id: 5, isChecked: true },
    { name: 'environment6', id: 6, isChecked: true }
  ];

  private _selectedTab = 0;
  get selectedTab(): number { return this._selectedTab; }

  get onTabChanged(): Observable<number> {
    return this._onTabChanged.asObservable();
  }
  private _onTabChanged = new Subject<number>();

  setTab(i: number): void {
    if (!this.validate(false)) { return; }
    this._selectedTab = i;
    this._onTabChanged.next(this._selectedTab);
  }

  private _isNeedValidate = !true;

  nextTab(i: number): void {
    if (!this.validate(true)) { return; }
    this._selectedTab += i;
    if (this._selectedTab < 0) { this._selectedTab = 0; }
    if (this._selectedTab > 1) { this._selectedTab = 1; }
    this._onTabChanged.next(this._selectedTab);
  }

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }
    return false;
  }

  cancel(): void {

  }

  save(): void {

  }

}
