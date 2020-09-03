import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-edit-user-general',
  templateUrl: './edit-user-general.component.html',
  styleUrls: ['./edit-user-general.component.scss']
})
export class EditUserGeneralComponent implements OnInit {

  constructor(
    public userEditService: UserEditService
  ) { }

  roleOptions: Array<SelectOption> = [
    { id: 1, text: 'End user', value: 'End User' },
    { id: 2, text: 'Admin', value: 'Admin' }
  ];

  dataOptions: Array<SelectOption> = [
    { id: 1, text: 'Syntatic', value: '1' },
    { id: 2, text: 'Original', value: '2' }
  ];

  coefficientOptions: Array<SelectOption> = [
    { id: 4, text: '4 (Default)', value: '4' },
    { id: 5, text: '5', value: '5' },
    { id: 6, text: '6', value: '6' },
    { id: 7, text: '7', value: '7' },
    { id: 8, text: '8', value: '8' },
    { id: 9, text: '9', value: '9' },
    { id: 10, text: '10', value: '10' }
  ];

  changedData(event: SelectOption, env: any): void {
    if (env.data === '2') {
      env.kf = 4;
      env.isShowAdvanced = false;
    }
  }

  showAdvanced(event: any, env: any): void {
    env.isShowAdvanced = true;
  }

  ngOnInit() {
    this.initUsers();
  }

  users: Array<any>;

  private initUsers(): void {
    if (this.userEditService.users) {
      this.users = this.userEditService.users.map(u => {
        return { name: u.login, id: u.id };
      }).sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      })
    }
  }

  selectUser(user: any): void {
    this.userEditService.securityUser = user;
  }
}
