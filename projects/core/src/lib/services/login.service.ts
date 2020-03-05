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

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseSibscriber implements CanActivate {

  get userInfo(): UserResponse { return this._userInfo; }
  private _userInfo: UserResponse;

  constructor(
    private dataService: DataService,
    private store: Store<any>
  ) {
    super();
    super.add(this.store.select(userSelector).subscribe(user => {
      this._userInfo = user;
    }));
  }

  static readonly TOKEN = 'token';
  static readonly USER = 'user';

  static IS_LOGEDIN(): boolean {
    return !!LoginService.getToken();
  }

  static getToken(): string {
    return '';
  }

  get isLogedIn(): boolean { return LoginService.IS_LOGEDIN(); }

  logOut(): void {
    this.store.dispatch(actions.logout());
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
