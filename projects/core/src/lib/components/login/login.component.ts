import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/LoginRequest';
import { LoginResponse } from '../../models/LoginResponse';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/actions/user.actions';
import { ENV } from '../../config/env';

@Component({
  selector: 'mdc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  @Output() success = new EventEmitter();
  @Output() fail = new EventEmitter<string>();

  onSubmit(): void {
    this.login({
      username: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value
    });
    this.loginForm.reset();
  }

  constructor(public loginService: LoginService, private store: Store<any>) {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      userName: new FormControl(),
      password: new FormControl()
    });
  }

  login(loginRequest: LoginRequest): void {
    if (!loginRequest.username.trim() || !loginRequest.password.trim()) { return; }
    this.loginService.login(loginRequest)
      .then((res: LoginResponse) => {
        if (res.token) {
          const token: string = res as any;
          this.store.dispatch(login({ payload: token }));
          this.loginService.setUserData(`${ENV.serverUrl}${ENV.endPoints.userData}`)
            .then(res => {
              this.success.emit();
              
            })
            .catch(e => { })
        } else {
          this.fail.emit(res.error);
        }
      })
      .catch(er => {
        this.fail.emit('Error request');
      });
  }
}
