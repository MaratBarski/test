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
    this.permissionSetService.validate(false);
  }

  completeResearcher(text: string): void {
    this.researchers = this._researchers.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchResearchText = text;
  }

  selectResearcher(setObj: any): void {
    this.permissionSetService.permissionSet.fromSetId = setObj.researchId;
    this.permissionSetService.validate(false);
  }

  selectUser(user: any): void {
    this.permissionSetService.permissionSet.project = undefined;
    this.permissionSetService.user = user;
    this.permissionSetService.permissionSet.userId = user.id;
    this.permissionSetService.validate(false);
  }

  completeUsers(text: string): void {
    this.users = this._users.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchUserText = text;
    this.permissionSetService.validate(false);
  }

  changedProject(id: string): void {
    this.permissionSetService.permissionSet.project = id;
    this.permissionSetService.loadTemplates();
    this.permissionSetService.validate(false);
  }

  onSizeChanged(size: number): void {
    if (!size) {
      this.isValidSize = false;
    } else {
      this.isValidSize = true;
    }
    this.permissionSetService.validate(false);
  }

  changeFromUnlimited(checked: boolean): void {
    this.permissionSetService.validate(false);
  }

  changeToUnlimited(checked: boolean): void {
    this.permissionSetService.validate(false);
  }

  validate(): void {
    this.permissionSetService.validate(false);
  }
}
