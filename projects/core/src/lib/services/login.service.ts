import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './data.service';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { ENV } from '../config/env';
import { Store } from '@ngrx/store';
import * as actions from '../store/actions/user.actions';
import { UserResponse } from '../models/UserInfo';
import { BaseSibscriber } from '../common/BaseSibscriber';
import { userSelector } from '../store/selectors/user.selectors';
import { userData } from '../store/actions/user.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, UserEnableMenu } from '../common/side-menu';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseSibscriber implements CanActivate {

  get userInfo(): UserResponse { return this._userInfo; }
  private _userInfo: UserResponse;
  private _userDataUpdated = new BehaviorSubject<UserResponse>(undefined);

  get onUserInfoUpdated(): Observable<UserResponse> {
    return this._userDataUpdated.asObservable();
  }

  constructor(
    private dataService: DataService,
    private store: Store<any>,
    private router: Router
  ) {
    super();
    super.add(this.store.select(userSelector).subscribe(user => {
      this._userInfo = user;
      this.setSuperAdmin();
      this.setAdmin();
      this._userDataUpdated.next(this._userInfo);
    }));
  }

  get isSuperAdmin(): boolean { return this._isSuperAdmin; }
  private _isSuperAdmin = false;

  get isAdmin(): boolean { return this._isAdmin; }
  private _isAdmin = false;

  get isResearcher(): boolean { return !this.isSuperAdmin && !this.isAdmin; }

  static readonly TOKEN = 'token';
  static readonly USER = 'user';

  static IS_LOGEDIN(): boolean {
    return !!LoginService.getToken();
  }

  static getToken(): string {
    return '';
  }

  private setSuperAdmin(): void {
    if (!this._userInfo || !this._userInfo.data || !this._userInfo.data.authorities || !this._userInfo.data.authorities.length) { return; }
    this._isSuperAdmin = !!this._userInfo.data.authorities.find((x: any) => x.UserAuthority && x.UserAuthority.authorityName && x.UserAuthority.authorityName.toUpperCase() === 'ROLE_SUPERADMIN');
  }

  private setAdmin(): void {
    if (!this._userInfo || !this._userInfo.data || !this._userInfo.data.projects || !this._userInfo.data.projects.length) { return; }
    this._isAdmin = !!this._userInfo.data.projects.find((x: any) => x.UserType && x.UserType.userType && x.UserType.userType.toUpperCase() === 'ADMIN');
  }

  get isLogedIn(): boolean { return LoginService.IS_LOGEDIN(); }

  logOut(): void {
    this.store.dispatch(actions.logout());
  }

  findProject(id: any): any {
    if (!this.userInfo) { return undefined; }
    if (!this.userInfo.data) { return undefined; }
    if (!this.userInfo.data.projects) { return undefined; }
    return this.userInfo.data.projects.find(x => x.projectId == id);
  }

  isProjectOwner(userLogin: string): boolean {
    if (!userLogin) { return false; }
    if (!this.userInfo) { return false; }
    if (!this.userInfo.data) { return false; }
    if (!this.userInfo.data.login) { return false; }
    return (this.userInfo.data.login === userLogin);
  }

  isAdminOfProject(projectID: any): any {
    if (!this.userInfo) { return undefined; }
    if (!this.userInfo.data) { return undefined; }
    if (!this.userInfo.data.projects) { return undefined; }

    return this.userInfo.data.projects.find(x => (x.projectId === projectID)
      &&
      ((x.userType && x.userType.userType && x.userType.userType.toUpperCase() === 'ADMIN') ||
        ((x as any).UserType && (x as any).UserType.userType && (x as any).UserType.userType.toUpperCase() === 'ADMIN')
      )
    )
  }

  filtermenu(items: Array<MenuItem>): Array<MenuItem> {
    if (this.isSuperAdmin) { return items; }
    if (this.isAdmin) {
      return items.filter(item => {
        return !!UserEnableMenu[item.id] && UserEnableMenu[item.id].admin;
      });
    }
    return items.filter(item => {
      return !!UserEnableMenu[item.id] && UserEnableMenu[item.id].researcher;
    });
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    return this.dataService.post(ENV.loginUrl, loginRequest)
      .toPromise().then((res: any) => {
        return new Promise((resolve, reject) => {
          if (res.token) {
            resolve(res);
          } else {
            reject();
          }
        })
      });
  }

  async setUserData(url: string): Promise<UserResponse> {
    return this.dataService.get(url)
      .toPromise().then((res: UserResponse) => {
        return new Promise((resolve, reject) => {
          if (res) {
            this.store.dispatch(userData({ payload: res }));
            resolve(res);
          } else {
            reject();
          }
        });
      });
  }

  checkPermission(id: any): void {
    if (!id) { return; }
    if (this.isSuperAdmin) { return; }
    if (this.isAdmin) {
      if (!UserEnableMenu[id] || !UserEnableMenu[id].admin) { this.router.navigate(['/access-denied']) }
      return;
    }
    if (!UserEnableMenu[id] || !UserEnableMenu[id].researcher) { this.router.navigate(['/access-denied']) }
  }

  canActivate() {
    // if (!this.isLogedIn) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    return true;
  }
}
