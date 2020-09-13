import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { UserNameSelectorComponent } from '../../forms/user-name-selector/user-name-selector.component';

@Component({
  selector: 'md-edit-user-general',
  templateUrl: './edit-user-general.component.html',
  styleUrls: ['./edit-user-general.component.scss']
})
export class EditUserGeneralComponent implements OnInit, AfterViewInit {

  @ViewChild('userNameCmp', { static: false }) userNameSelectorCmp: UserNameSelectorComponent;

  constructor(
    public userEditService: UserEditService
  ) { }

  ngOnInit() {
    this.initUsers();
  }

  users: Array<any>;

  onChangeValue(): void {
    this.userEditService.validate(false);
  }

  private initUsers(): void {
    if (this.userEditService.users) {
      this.users = this.userEditService.users.map(u => {
        return { name: u.login, id: u.id };
      }).sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      })
    }
  }

  ngAfterViewInit(): void {
    if (this.userNameSelectorCmp && this.userEditService.user.login) {
      this.userNameSelectorCmp.setUser(this.userEditService.user.login);
    }
  }

  selectUser(user: any): void {
    this.userEditService.securityUser = user;
  }

  clearUser(): void {
    this.userEditService.securityUser = undefined;
  }
}
