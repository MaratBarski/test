import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  constructor() { }

  private _selectedTab = 0;
  get selectedTab(): number { return this._selectedTab; }

  setTab(i: number): void {
    //if (!this.validate(false)) { return; }
    this._selectedTab = i;
    //this._onTabChanged.next(this._selectedTab);
  }

}
