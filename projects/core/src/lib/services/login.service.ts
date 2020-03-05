import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { ENV } from '../config/env';
import { Store } from '@ngrx/store';
import * as actions from '../store/actions/user.actions';
import { LocalStorageService } from './local-storage.service';
import { UserInfo } from '../models/UserInfo';
import { BaseSibscriber } from '../common/BaseSibscriber';
import { userSelector } from '../store/selectors/user.selectors';
import { login, userData } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseSibscriber implements CanActivate {
  userInfo: UserInfo;
  constructor(
    private dataService: DataService,
    private router: Router,
    private store: Store<any>
  ) {
    super();
    super.add(this.store.select(userSelector).subscribe(user => {
      this.userInfo = user;
    }));
  }

  static readonly TOKEN = 'token';
  static readonly USER = 'user';

  static IS_LOGEDIN(): boolean {
    return !!LoginService.getToken();
  }

  static getToken(): string {
     const user: UserInfo = LocalStorageService.getObject(LoginService.TOKEN);
     return user && user.token ? user.token : undefined;
  }

  get isLogedIn(): boolean { return LoginService.IS_LOGEDIN(); }

  logOut(): void {
    this.store.dispatch(actions.logout());
  }

  login(loginRequest: LoginRequest): Promise<LoginResponse> {
    return this.dataService.post(ENV.loginUrl, loginRequest)
      .toPromise().then(res => {
        return new Promise((resolve, reject) => {
          if (res.token) {
            resolve(res);
          } else {
            reject();
          }
        })
      });
  }

  setUserData(): Promise<any> {
    return this.dataService.get(`${ENV.serverUrl}${ENV.endPoints.userData}`)
      .toPromise().then(res => {
        return new Promise((resolve, reject) => {
          if (res) {
            const userInfo: UserInfo = res as any;
            this.store.dispatch(userData({ payload: userInfo }));
            resolve(res);
          } else {
            reject();
          }
        });
      });
  }

  canActivate() {
    return true;
    // return this.setUserData().then(data => {
    //   console.log(data);
    //   return true;
    // }).catch(error => {
    //   console.log(error);
    //   return false;
    // });
    
    /*if (!this.isLogedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;*/
  }
}
