import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService, DateService, NotificationsService, TableModel, ToasterType } from '@appcore';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/shared/services/config.service';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { NO_ALLOWED_EVENTS, BASED_EVENTS, ALL_EVENTS } from '../models/models';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  showCancelConfirm = false;
  redirectUrl = '';

  missingItem = {
    firstName: {
      isMissing: false,
      isError: false
    },
    lastName: {
      isMissing: false,
      isError: false
    },
    email: {
      isMissing: false,
      isError: false
    },
    userName: {
      isMissing: false,
      isError: false,
      validate: (): boolean => {
        if (this.securityType) { return true; }
        if (this.mode === 1) { return true; }
        return !this.isEmpty(this.user.userName);
      }
    },
    password: {
      isMissing: false,
      isError: false,
      validate: (): boolean => {
        if (this.securityType) { return true; }
        if (this.isEmpty(this.user.password) && this.mode !== 1) {
          return false;
        }
        return true;
      }
    },
  }

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private http: HttpClient,
    private dateService: DateService,
    private configService: ConfigService,
    private notificationService: NotificationsService
  ) {
    this.initSecurity();
  }

  isUserNameValid = true;
  isPasswordValid = true;
  isEmaileValid = true;
  isEnvironmetValid = true;

  addSet(ps: any): void {
    this.user.permissionSets = [ps].concat(this.user.permissionSets);
  }

  removeSet(ps: any): void {
    this.user.permissionSets = this.user.permissionSets.filter(x => x !== ps);
  }

  get securityType(): number {
    return this._securityType;
  }

  private _securityType: number;

  set securityUser(user: any) {
    this._securityUser = user;
    this._systmeUser = this.users.find(x => x.id === user.id);
    if (this._systmeUser) {
      this.user.userName =
        this.user.login = this._systmeUser.login;
    }
  }
  get securityUser(): any {
    return this._securityUser;
  }
  private _securityUser: any;
  private _systmeUser: any;

  get users(): Array<any> {
    return this._users;
  }

  private _users: Array<any>;

  initSecurity(): void {
    this._securityType = parseInt(this.configService.getValue('security').toString());
    if (this._securityType) {
      this._users = undefined;
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    this.http.get(this._adUsersUrl).subscribe((res: any) => {
      this._users = res.data;
    }, error => {

    });
  }

  @Offline('assets/offline/userList.json?')
  private _usersUrl = `${environment.serverUrl}${environment.endPoints.userList}`;

  @Offline('assets/offline/adUsers.json?')
  private _adUsersUrl = `${environment.serverUrl}${environment.endPoints.adUsers}`;

  @Offline('assets/offline/selectedUser.json?')
  private _userUrl = `${environment.serverUrl}${environment.endPoints.userList}`;

  @Offline('assets/offline/selectedResearch.json?')
  private _setUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  @Offline('assets/offline/projects.json?')
  private _projectUrltUrl = `${environment.serverUrl}${environment.endPoints.project}`;

  @Offline('assets/offline/research.json?')
  private getPermissionSetsUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  get user(): any {
    return this._user;
  }
  private _user: any;

  get isLoading(): boolean {
    return this._isLoading || (this.securityType && (!this.users || !this.users.length));
  }

  get isHidden(): boolean {
    return this._isHidden;
  }

  private _isLoading = false;
  private _isHidden = false;

  get environments(): Array<any> {
    return this._environments;
  }
  private _environments: Array<any>;

  getUserById(id: number): Observable<any> {
    return id ? this.http.get(`${this._userUrl}/${id}`) : of(this.getDefault());
  }

  getPermissionSets(userId: number): Observable<any> {
    return userId ? this.http.get(`${this.getPermissionSetsUrl}`) : of(undefined);
  }

  getAllowedEvent(permSet: any): number {
    if (permSet.researchStatus && permSet.researchStatus.toLowerCase() === 'open') {
      if (!permSet.researchTemplates || !permSet.researchTemplates.length) {
        return ALL_EVENTS;
      }
      if (permSet.researchTemplates && permSet.researchTemplates.length) {
        return BASED_EVENTS;
      }
    }
    if (permSet.researchStatus && permSet.researchStatus.toLowerCase() === 'initial') {
      return NO_ALLOWED_EVENTS;
    }
    return BASED_EVENTS;
  }

  initSets(sets: any): void {
    this._user.permissionSets = [];
    if (!sets) { return; }
    if (sets.data) {
      sets = sets.data;
    }
    sets = sets.filter(s => s.userId === this._user.id);
    this._user.permissionSets = sets.map(s => {
      return {
        ps: {
          isFromServer: true,
          researchId: s.researchId,
          setName: s.researchName,
          projectName: s.project ? s.project.projectName : '',
          project: s.project ? s.project.projectId : 0,
          keyName: s.approvalKey,
          isNew: true,
          KeyStatus: s.researchStatus.toLowerCase() === 'open',
          isActive: (s.researchStatus && (s.researchStatus.toLowerCase() === 'open' || s.researchStatus.toLowerCase() === 'initial')),
          size: s.maxPatients,
          fromDate: new Date(s.startDate),
          toDate: new Date(s.endDate),
          allowedEvent: this.getAllowedEvent(s),
          researchTemplates: s.researchTemplates,
          isExpired: s.approvalKeyExpirationDate ? (new Date() > new Date(s.approvalKeyExpirationDate) ? true : false) : false,
          researchRestrictionEvents: s.researchRestrictionEvents ?
            s.researchRestrictionEvents.map(x => {
              return {
                eventId: x.eventId,
                eventPropertyName: x.eventPropertyName,
                value: x.value
              };
            }) :
            []
        }
      }
    });
  }

  loadUser(id: number): void {
    this._isLoading = true;
    this._isHidden = true;
    forkJoin(
      this.getUserById(id),
      this.http.get(this._projectUrltUrl),
      this.getPermissionSets(id)
    )
      .pipe(take(1))
      .subscribe(([user, projects, sets]: any) => {
        this._user = user.data;
        this._user.userName = this._user.login;
        this._user.isSuperAdmin = !!(this._user.authorities
          && this._user.authorities.length
          && this._user.authorities.find(x =>
            (x.UserAuthority && x.UserAuthority.authorityName && x.UserAuthority.authorityName.toUpperCase() === 'ROLE_SUPERADMIN')
            ||
            (x.authorityName && x.authorityName.toUpperCase() === 'ROLE_SUPERADMIN')
          ));
        this._user.enabled = this._user.activated;
        this._environments = projects.data;
        this._environments.forEach(x => {
          const env = this._user.projects ? this._user.projects.find(p => p.projectId === x.projectId) : undefined;
          x.isChecked = !!env;
          x.role = 1;
          x.data = 1;
          x.kf = 4;
          x.isShowAdvanced = false;
          if (env && env.UserType) {
            x.role = env.UserType.userType.toUpperCase() === 'ADMIN' ? 2 : 1;
            x.data = env.UserType.anonymityLevel === 1 ? 2 : 1;
            x.kf = Math.min(Math.max(env.UserType.anonymityLevel, 4), 10);
          }
        });
        this.initSets(sets)
        this._isLoading = false;
        setTimeout(() => {
          this._isHidden = false;
        }, 1000);
      });
  }

  get mode() { return this._mode; }
  private _mode = 0;

  resetService(info: any): void {
    this.isChanged = false;
    this._selectedTab = 0;
    this._mode = info.mode;
    this.resetValidation();
    this.loadUser(info.id);
  }

  isChanged = false;

  isHasChanges(): boolean {
    return this.isChanged;
  }

  getDefault(): any {
    return {
      data: {
        isNew: true,
        id: '0',
        login: '',
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        activated: true,
        langKey: "en",
        activationKey: undefined,
        resetKey: '',
        createdBy: '',
        createdDate: undefined,
        resetDate: undefined,
        lastModifiedBy: '',
        lastModifiedDate: undefined,
        cellPhone: '',
        phone: '',
        domain: "",
        photo: undefined,
        enabled: true,
        isSuperAdmin: false,
        permissionSets: [],
        projects: []
      }
    };
  }

  cancelConfirm(): void {
    this.showCancelConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/users');
  }

  private _selectedTab = 0;
  get selectedTab(): number { return this._selectedTab; }

  initTab(i: number): void { this._selectedTab = i; }

  get onTabChanged(): Observable<number> {
    return this._onTabChanged.asObservable();
  }
  private _onTabChanged = new Subject<number>();

  setTab(i: number): void {
    if (!this.validate(false)) { return; }
    this._selectedTab = i;
    this._onTabChanged.next(this._selectedTab);
  }

  nextTab(i: number): void {
    if (!this.validate(true)) { return; }
    this._selectedTab += i;
    if (this._selectedTab < 0) { this._selectedTab = 0; }
    if (this._selectedTab > 1) { this._selectedTab = 1; }
    this._onTabChanged.next(this._selectedTab);
  }

  private _isNeedValidate = true;

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }
    this.resetValidation();
    if (this.mode === 2) { return true; }
    let res = true;
    const pwdValid = this.validatePassword();
    const userNameValid = this.validateUserName();
    const emailValid = this.validateEmail();
    const envValid = this.validateEnvironment();
    res = userNameValid && pwdValid && emailValid && envValid;
    Object.keys(this.missingItem).forEach(k => {
      if (this.missingItem[k].validate) {
        if (!this.missingItem[k].validate()) {
          this.missingItem[k].isMissing = true;
          this.missingItem[k].isError = true;
          res = false;
        }
        return;
      }
      if (this.isEmpty(this.user[k])) {
        this.missingItem[k].isMissing = true;
        this.missingItem[k].isError = true;
        res = false;
      }
    });

    return res;
  }

  validateEmail(): boolean {
    this.isEmaileValid = true;
    if (!this.user.email || !this.user.email.trim()) {
      return this.isEmaileValid;
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isEmaileValid = re.test(this.user.email);
    return this.isEmaileValid;
  }

  validateUserName(): boolean {
    this.isUserNameValid = true;
    if (this.securityType) {
      return this.isUserNameValid;
    }
    if (this.mode === 1) {
      return this.isUserNameValid;
    }
    if (!this.user.userName || !this.user.userName.trim()) {
      this.isUserNameValid = true;
      return this.isUserNameValid;
    }
    const userName = this.user.userName.trim().toLowerCase() as string;
    if (userName.length > 14) {
      this.isUserNameValid = false;
      return this.isUserNameValid;
    }
    if (!/^[a-z0-9A-Z_]+$/.test(userName)) {
      this.isUserNameValid = false;
    }
    return this.isUserNameValid;
  }

  validateEnvironment(): boolean {
    this.isEnvironmetValid = !!this.environments.find(x => x.isChecked);
    return this.isEnvironmetValid;
  }

  validatePassword(): boolean {
    this.isPasswordValid = true;
    if (this.securityType) {
      return this.isPasswordValid;
    }
    if ((!this.user.password || !this.user.password.trim()) && this.mode === 1) {
      return this.isPasswordValid;
    }
    if (!this.user.password || !this.user.password.trim()) {
      this.isPasswordValid = true;
      return this.isPasswordValid;
    }
    const password = this.user.password.trim() as string;
    if (password.length < 8) {
      this.isPasswordValid = false;
      return this.isPasswordValid;
    }
    [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,80}$/, /^[a-z0-9A-Z]+$/].forEach(r => {
      if (!r.test(password)) {
        this.isPasswordValid = false;
        return;
      }
    });
    return this.isPasswordValid;
  }

  private isEmpty(value: any): boolean {
    if (!value) { return true; }
    return value.toString().trim() === '';
  }

  private setSuperAdmin(res: any): void {
    res.authorities = (this.user.authorities || []).filter(x => x.UserAuthority
      && x.UserAuthority.authorityName
      && x.UserAuthority.authorityName.toUpperCase() !== 'ROLE_SUPERADMIN');
    if (this.user.isSuperAdmin) {
      res.authorities.push({
        authorityName: 'ROLE_SUPERADMIN',
        name: 'ROLE_SUPERADMIN',
        UserAuthority: {
          userId: this.user.id,
          authorityName: 'ROLE_SUPERADMIN'
        }
      })
    }
  }

  private setProjects(res: any): void {
    res.userTypes = this.environments
      .filter(env => env.isChecked)
      .map(env => {
        return {
          projectId: env.projectId,
          userType: env.role === 1 ? 'researcher'.toUpperCase() : 'admin'.toUpperCase(),
          anonymityLevel: env.data === 1 ? env.kf : 1
        };
      });
  }

  private setResearches(res: any): void {
    res.researches = [];
    this.user.permissionSets.forEach(s => {
      res.researches.push(s.researcher);
    });
  }

  createServerRequest(): any {
    const res = {
      login: this.securityType ? (this._systmeUser ? this._systmeUser.login : '') : this.user.userName,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      cellPhone: this.user.cellPhone,
      activated: this.user.activated || this.user.enabled
    } as any;
    if (this.user.password) {
      res.password = this.user.password;
    }
    this.setSuperAdmin(res);
    this.setProjects(res);
    this.setResearches(res);

    return res;
  }

  resetValidation(): void {
    this.isUserNameValid = true;
    this.isPasswordValid = true;
    this.isEmaileValid = true;
    this.isEnvironmetValid = true;
    Object.keys(this.missingItem).forEach(k => {
      this.missingItem[k].isMissing = false;
      this.missingItem[k].isError = false;
    });
  }

  cancel(): void {
    this.navigationService.navigate('/users');
  }

  private createNew(req: any): void {
    console.log(req);
    this.http.post(this._userUrl, req)
      .pipe(take(1))
      .subscribe(res => {
        this._isLoading = false;
        this.router.navigateByUrl('/users');
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'User added successfully',
          comment: 'User added successfully',
          type: ToasterType.success
        });
      }, error => {
        this._isLoading = false;
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'Error add user',
          comment: error.error && error.error.massage ? error.error.massage : 'Failed to create new User',
          type: ToasterType.error
        });
      })
  }

  private updateUser(req: any): void {
    delete req.researches;
    this.http.put(`${this._userUrl}/${this.user.id}`, req)
      .pipe(take(1))
      .subscribe(res => {
        this._isLoading = false;
        this.router.navigateByUrl('/users');
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'User updated successfully',
          comment: 'User updated successfully',
          type: ToasterType.success,
          displayPeriod: 4
        });
      }, error => {
        this._isLoading = false;
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'Error update user',
          comment: 'Error',
          type: ToasterType.error,
          displayPeriod: 4
        });
      })
  }

  private updateResearchers(req: any): void {
    this.http.put(`${this._userUrl}/${this.user.id}`, req)
      .pipe(take(1))
      .subscribe(res => {
        this._isLoading = false;
        this.router.navigateByUrl('/users');
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'Permission set updated successfully',
          comment: 'Permission set updated successfully',
          type: ToasterType.success
        });
      }, error => {
        this._isLoading = false;
        this.notificationService.addNotification({
          showInToaster: true,
          isClientOnly: true,
          name: 'Error update permission set',
          comment: 'Error',
          type: ToasterType.error
        });
      })
  }

  save(): void {
    if (!this.validate(true)) { return; }
    const req = this.createServerRequest();
    this._isLoading = true;
    //document.write(JSON.stringify(req));
    if (!this.mode) {
      this.createNew(req);
    } else if (this.mode === 1) {
      this.updateUser(req);
    } else if (this.mode === 2) {
      this.updateResearchers(req);
    }
  }

  replaceResearcher(src: any, dist: any): void {
    const index = this._user.permissionSets.findIndex(x => x = src);
    if (index < 0) { return; }
    this._user.permissionSets[index] = dist;
  }

  getSetTable(): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit',
            icon: 'ic-edit',
            command: 'edit'
            , checkDisabled: (source: any) => {
              return false;
            }
          }
        ],
        subLinks: [
          {
            text: 'Delete',
            icon: 'ic-delete',
            command: 'delete'
            , checkDisabled: (source: any) => {
              return false;
            }
          }
        ]
      },
      headers: [
        {
          columnId: 'PermissionSetName',
          text: 'Permission Set Name',
          isSortEnabled: true,
          csvTitle: 'Permission Set Name',
          showDetails: false,
          css: 'admin-table__item admin-table__perm-40 w-xxl-20 w-xxxl-25',
          cellCss: 'admin-table__item',
          cellContainerCss: 'admin-table__name'
        },
        {
          columnId: 'Environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment',
          css: 'admin-table__item d-none d-lg-table-cell admin-table__perm-20',
          cellCss: 'admin-table__item d-none d-lg-table-cell',
          cellContainerCss: 'admin-table__text-cut'
        },
        {
          columnId: 'ApprovalKey',
          text: 'Approval Key',
          isSortEnabled: true,
          csvTitle: 'Approval Key',
          css: 'admin-table__item d-none d-xxl-table-cell'
        },
        {
          columnId: 'approvalKeyExpirationDate',
          text: 'Key Expiration date',
          hidden: true,
          csvTitle: 'Key Expiration date'
        },
        {
          columnId: 'KeyStatus',
          text: 'Key Status',
          csvTitle: 'Key Status',
          css: 'admin-table__item d-none d-xxl-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'Active',
          text: 'Active',
          csvTitle: 'Active',
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'maxPatients',
          text: 'Allowed cohort size',
          csvTitle: 'Allowed cohort size',
          hidden: true
        },
        {
          columnId: 'startDate',
          text: 'Allowed date range',
          csvTitle: 'From',
          hidden: true
        },
        {
          columnId: 'endDate',
          text: 'Allowed date range',
          csvTitle: 'To',
          hidden: true
        },
        {
          columnId: 'PermissionTemplate',
          text: 'Permission template',
          csvTitle: 'Permission template',
          hidden: true
        },
        {
          columnId: 'Allowedcontent',
          text: 'Allowed content',
          csvTitle: 'Allowed content',
          hidden: true
        },
        {
          columnId: 'isExpired',
          hidden: true,
        }
      ],
      rows: []
    }
    this._user.permissionSets.forEach((fl, i) => {
      data.rows.push({
        cells: {
          PermissionSetName: fl.ps.setName,
          Environment: fl.ps.projectName,
          ApprovalKey: fl.ps.keyName,
          KeyStatus: 'New',
          Active: fl.ps.isActive,
          maxPatients: fl.ps.size,
          startDate: fl.ps.fromDate,
          endDate: fl.ps.toDate,
          isExpired: fl.ps.isFromServer ? fl.ps.isExpired :
            fl.ps.keyExpirationDate ? (new Date() > new Date(fl.ps.keyExpirationDate) ? true : false) : false,
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
