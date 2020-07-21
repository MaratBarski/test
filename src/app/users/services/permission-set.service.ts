import { Injectable } from '@angular/core';

export class PermissionSet {
  isNew: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionSetService {

  constructor() {
    this._permissionSet = this.getDefault();
  }

  private _permissionSet: PermissionSet;

  get permissionSet(): PermissionSet {
    return this._permissionSet;
  }

  getDefault(): PermissionSet {
    return {
      isNew: true
    }
  }
}
