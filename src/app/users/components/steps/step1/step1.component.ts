import { Component, OnInit, ViewChild, EventEmitter, AfterViewInit, Input, Output } from '@angular/core';
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

  @Input() isOfflineMode = false;
  @Output() onAfterinit = new EventEmitter();

  ngAfterViewInit(): void {
    if (this.permissionSetService.isEditMode || this.isOfflineMode) {
      this.projectCmp.disabled = this.permissionSetService.isEditMode;
      super.add(this.loginService.onUserInfoUpdated.subscribe((response: UserResponse) => {
        if (this.permissionSetService.permissionSet.project && this.projectCmp) {
          this.projectCmp.projectModel = this.permissionSetService.permissionSet.project;
        }
      }));
    }
    if (this.isOfflineMode) {
      super.add(
        this.permissionSetService.onTemplatesLoaded.subscribe(() => {
          this.onAfterinit.emit();
        }));
      this.permissionSetService.loadTemplates(false);
      this.permissionSetService.fromSetId = this.permissionSetService.permissionSet.fromSetId || 0;
      if (this.permissionSetService.permissionSet.fromSetName && this.setselectorCmp) {
        setTimeout(() => {
          this.setselectorCmp.inputText = this.permissionSetService.permissionSet.fromSetName;
        }, 1);
      }
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

  @Input() isPopup = false;

  searchResearchText = '';
  searchUserText = '';
  isValidSize = true;

  researchers: Array<any> = [];
  private _researchers: Array<any>;
  isShowChangeEnvironmentConfirm = false;
  isResearcherChanged = false;

  users: Array<any> = [];
  private _users: Array<any>;

  ngOnInit() {
    this._researchers = this.permissionSetService.getResearchers();
    this._users = this.permissionSetService.getUsers();
    this.applySetUser();
  }

  activateSet(isActive: boolean): void {
    // const status = isActive ? 'activated' : 'deactivated';
    // const comment = isActive ? 'User can now query data according to the permission set.' : 'User can no longer query data according to the permission set.';
    // this.notificationService.addNotification({
    //   type: ToasterType.success,
    //   name: `The permission set has been ${status}.`,
    //   showInToaster: true,
    //   comment: comment,
    //   isClientOnly: true
    // });
  }

  private applySetUser(): void {
    if (this.permissionSetService.user) {
      setTimeout(() => { this.userNameCmp.inputText = `${this.permissionSetService.user.firstName} ${this.permissionSetService.user.lastName}`; }, 1);

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
    setTimeout(() => { this.userNameCmp.inputText = ''; }, 1);
  }

  changeIsNew(isNew: boolean): void {
    this.permissionSetService.permissionSet.isNew = isNew;
    if (isNew) {
      this.permissionSetService.permissionSet.fromSetId = 0;
      this.permissionSetService.permissionSet.fromSetName = undefined;
    }
    this.isResearcherChanged = false;
    this.permissionSetService.isAfterValidate = false;
    this.permissionSetService.changeSource();
    if (this.userNameCmp) {
      setTimeout(() => { this.userNameCmp.inputText = ''; }, 1);

    }
    if (this.setselectorCmp) {
      setTimeout(() => { this.setselectorCmp.inputText = ''; }, 1);
    }
    this.permissionSetService.validate(false);
  }

  completeResearcher(text: string): void {
    this.researchers = this._researchers.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchResearchText = text;
  }

  selectResearcher(setObj: any): void {
    if (this.permissionSetService.fromSetId === setObj.researchId) { return; }
    this.isResearcherChanged = true;
    this.permissionSetService.cloneSet(setObj);
    this.permissionSetService.validate(false);
    this.permissionSetService.permissionSet.userId = undefined;
    this.permissionSetService.user = undefined;
    this.permissionSetService.permissionSet.projectName = this.projectCmp.getProjectById(this.permissionSetService.permissionSet.project).text;
    this.applySetUser();
    this.hideUserName();
    this.permissionSetService.permissionSet.fromSetId = this.permissionSetService.fromSetId;
    setTimeout(() => { this.permissionSetService.permissionSet.fromSetName = this.setselectorCmp.inputText; }, 1);
  }

  selectUser(user: any): void {
    this.permissionSetService.user = user;
    this.permissionSetService.permissionSet.userId = user.id;
    this.permissionSetService.validate(false);
    if (this.permissionSetService.user.projects && this.permissionSetService.user.projects.length === 1) {
      this.projectCmp.projectModel = this.permissionSetService.user.projects[0].projectId;
      this.permissionSetService.permissionSet.project = this.permissionSetService.user.projects[0].projectId;
      this.permissionSetService.permissionSet.projectName = this.projectCmp.selectedOption.text;
      this.permissionSetService.loadTemplates(false);
      return;
    }
    const proj = this.permissionSetService.user.projects.find(x => x.projectId === this.projectCmp.projectModel);
    if (proj) {
      this.projectCmp.projectModel = proj.projectId;
      this.permissionSetService.permissionSet.project = proj.projectId;
      this.permissionSetService.permissionSet.projectName = this.projectCmp.selectedOption.text;
      this.permissionSetService.loadTemplates(false);
      return;
    }
    this.permissionSetService.permissionSet.project = undefined;
  }

  completeUsers(text: string): void {
    this.users = this._users
      .filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
      .sort((a, b) => {
        if (!a.name && !b.name) { return 0; }
        if (!a.name && b.name) { return 1; }
        if (a.name && !b.name) { return -1; }
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
    this.searchUserText = text;
    this.permissionSetService.validate(false);
  }

  tempProjectId = '';
  changedProject(id: string): void {
    if (this.isResearcherChanged) {
      this.tempProjectId = id;
      this.isResearcherChanged = false;
      this.isShowChangeEnvironmentConfirm = true;
      return;
    }
    this.confirmChangeProject(id);
  }

  confirmChangeProject(id: string = undefined): void {
    if (!id) { id = this.tempProjectId; }
    this.permissionSetService.permissionSet.project = id;
    this.permissionSetService.permissionSet.projectName = this.projectCmp.selectedOption.text;
    this.permissionSetService.loadTemplates(false);
    this.permissionSetService.validate(false);
    this.isShowChangeEnvironmentConfirm = false;
  }

  cancelChangeProject(): void {
    this.isShowChangeEnvironmentConfirm = false;
    this.isResearcherChanged = true;
    this.projectCmp.projectModel = this.permissionSetService.permissionSet.project;
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
