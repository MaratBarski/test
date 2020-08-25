import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';
import { BaseSibscriber, AutoCompleteComponent, NotificationsService, ToasterType, LoginService, UserResponse } from '@appcore';
import { ProjectComboComponent } from '@app/shared/components/project-combo/project-combo.component';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component extends BaseSibscriber implements OnInit, AfterViewInit {

  constructor(
    public permissionSetService: PermissionSetService,
    private notificationService: NotificationsService,
    private loginService: LoginService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.permissionSetService.isEditMode) {
      this.projectCmp.disabled = true;
      super.add(this.loginService.onUserInfoUpdated.subscribe((response: UserResponse) => {
        if (this.permissionSetService.permissionSet.project && this.projectCmp) {
          this.projectCmp.projectModel = this.permissionSetService.permissionSet.project;
        }
      }));
    }
  }

  clearUser(): void {
    this.permissionSetService.user = undefined;
    this.permissionSetService.permissionSet.userId = undefined;
    this.permissionSetService.isAfterValidate = false;
  }

  @ViewChild('userNameCmp', { static: true }) userNameCmp: AutoCompleteComponent;
  @ViewChild('projectCmp', { static: false }) projectCmp: ProjectComboComponent;
  @ViewChild('setselectorCmp', { static: false }) setselectorCmp: AutoCompleteComponent;

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
    this.applySetUser();
  }

  activateSet(isActive: boolean): void {
    const status = isActive ? 'activated' : 'deactivated';
    const comment = isActive ? 'User can now query data according to the permission set.' : 'User can no longer query data according to the permission set.';
    this.notificationService.addNotification({
      type: ToasterType.success,
      name: `The permission set has been ${status}.`,
      showInToaster: true,
      comment: comment,
      isClientOnly: true
    });
  }

  private applySetUser(): void {
    if (this.permissionSetService.user) {
      this.userNameCmp.inputText = `${this.permissionSetService.user.firstName} ${this.permissionSetService.user.lastName}`;
      if (!this.permissionSetService.isEditMode) {
        this.hideUserName();
        this.userNameCmp.disabled = false;
      } else {
        this.userNameCmp.disabled = true;
      }
    }
    if (this.permissionSetService.permissionSet.project && this.projectCmp) {
      this.projectCmp.projectModel = this.permissionSetService.permissionSet.project;
    }
  }

  private hideUserName(): void {
    this.userNameCmp.inputText = '';
  }

  changeIsNew(): void {
    this.permissionSetService.isAfterValidate = false;
    this.permissionSetService.changeSource();
    if (this.userNameCmp) {
      this.userNameCmp.inputText = '';
    }
    if (this.setselectorCmp) {
      this.setselectorCmp.inputText = '';
    }
    this.permissionSetService.validate(false);
  }

  completeResearcher(text: string): void {
    this.researchers = this._researchers.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchResearchText = text;
  }

  selectResearcher(setObj: any): void {
    if (this.permissionSetService.fromSetId === setObj.researchId) { return; }
    this.permissionSetService.cloneSet(setObj);
    this.permissionSetService.validate(false);
    this.permissionSetService.permissionSet.userId = undefined;
    this.permissionSetService.user = undefined;
    this.applySetUser();
    this.hideUserName();
  }

  selectUser(user: any): void {
    this.permissionSetService.permissionSet.project = undefined;
    this.permissionSetService.user = user;
    this.permissionSetService.permissionSet.userId = user.id;
    this.permissionSetService.validate(false);

    if (this.permissionSetService.user.projects && this.permissionSetService.user.projects.length === 1) {
      this.projectCmp.projectModel = this.permissionSetService.user.projects[0].projectId;
      this.permissionSetService.permissionSet.project = this.permissionSetService.user.projects[0].projectId;
    }
  }

  completeUsers(text: string): void {
    this.users = this._users.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchUserText = text;
    this.permissionSetService.validate(false);
  }

  changedProject(id: string): void {
    this.permissionSetService.permissionSet.project = id;
    this.permissionSetService.loadTemplates(false);
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
