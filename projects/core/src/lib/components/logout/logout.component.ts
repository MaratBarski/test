import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'mdc-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(public loginService: LoginService) {}

  logOut(): void {
    this.loginService.logOut();
  }
}
