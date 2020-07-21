import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  project = '';
  searchResearchText = '';
  searchUserText = '';
  isValidSize = true;

  researchers: Array<any> = [];
  private _researchers: Array<any>;

  users: Array<any> = [];
  private _users: Array<any>;

  ngOnInit() {
    this._researchers = this.permissionSetService.getResearchers();
    this._users = this.permissionSetService.getUsers();
  }

  changeIsNew(): void {
    //alert(this.permissionSetService.permissionSet.isNew);
  }

  completeResearcher(text: string): void {
    this.researchers = this._researchers.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchResearchText = text;
  }

  selectResearcher($event) {
  }

  completeUsers(text: string): void {
    this.users = this._users.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchUserText = text;
  }

  selectUser($event) {
  }

  changedProject(id: string): void {
    this.project = id;
  }

  onSizeChanged(size: number): void {
    if (!size) {
      this.isValidSize = false;
    } else {
      this.isValidSize = true;
    }
  }

  changeFromUnlimited(checked: boolean): void {
    alert(checked);
  }

  changeToUnlimited(checked: boolean): void {
    alert(checked);
  }
}
