import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  missingItem = {
    firstName: {
      isMissing: false,
      isError: false
    },
    lastName: {
      isMissing: false,
      isError: false
    },
    email: {
      isMissing: false,
      isError: false
    }
  }

  constructor() { }

  user = {
    isSuperAdmin: false,
    enabled: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
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

  nextTab(i: number): void {
    if (!this.validate(true)) { return; }
    this._selectedTab += i;
    if (this._selectedTab < 0) { this._selectedTab = 0; }
    if (this._selectedTab > 1) { this._selectedTab = 1; }
    this._onTabChanged.next(this._selectedTab);
  }

  private _isNeedValidate = true;

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }

    this.resetValidation();
    let res = true;
    Object.keys(this.missingItem).forEach(k => {
      if (this.isEmpty(this.user[k])) {
        this.missingItem[k].isMissing = true;
        this.missingItem[k].isError = true;
        res = false;
      }
    });
    return res;
  }

  private isEmpty(value: any): boolean {
    if (!value) { return true; }
    return value.toString().trim() === '';
  }

  resetValidation(): void {
    Object.keys(this.missingItem).forEach(k => {
      this.missingItem[k].isMissing = false;
      this.missingItem[k].isError = false;
    });
  }

  cancel(): void {

  }

  save(): void {

  }

}
