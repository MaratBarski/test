import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
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
    private store: Store<any>
  ) {
    super();
    super.add(this.store.select(userSelector).subscribe(user => {
      this._userInfo = user;
      this.setSuperAdmin();
      this._userDataUpdated.next(this._userInfo);
    }));
  }
  get isSuperAdmin(): boolean {
    return this._isSuperAdmin;
  }
  private _isSuperAdmin = false;

  static readonly TOKEN = 'token';
  static readonly USER = 'user';

  static IS_LOGEDIN(): boolean {
    return !!LoginService.getToken();
  }

  static getToken(): string {
    return '';
  }

  private setSuperAdmin(): boolean {
    if (!this._userInfo || !this._userInfo.data || !this._userInfo.data.authorities || !this._userInfo.data.authorities.length) { return false; }
    this._isSuperAdmin = !!this._userInfo.data.authorities.find((x: any) => x.UserAuthority && x.UserAuthority.authorityName && x.UserAuthority.authorityName.toUpperCase() === 'ROLE_SUPERADMIN');
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

  canActivate() {
    // if (!this.isLogedIn) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    return true;
  }
}
