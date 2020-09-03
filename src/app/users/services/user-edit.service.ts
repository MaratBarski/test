import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService, DateService, NotificationsService, TableModel } from '@appcore';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/shared/services/config.service';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

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
      isError: false
    },
    password: {
      isMissing: false,
      isError: false
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
  }
  get securityUser(): any {
    return this._securityUser;
  }
  private _securityUser: any;

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
    this.http.get(this._usersUrl).subscribe((res: any) => {
      this._users = res.data;
    }, error => {

    });
  }

  @Offline('assets/offline/userList.json?')
  private _usersUrl = `${environment.serverUrl}${environment.endPoints.userList}`;

  @Offline('assets/offline/selectedUser.json?')
  private _userUrl = `${environment.serverUrl}${environment.endPoints.userList}`;

  @Offline('assets/offline/selectedResearch.json?')
  private _setUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  @Offline('assets/offline/projects.json?')
  private _projectUrltUrl = `${environment.serverUrl}${environment.endPoints.project}`;

  get user(): any {
    return this._user;
  }
  private _user: any;

  get isLoading(): boolean {
    return this._isLoading || (this.securityType && (!this.users || !this.users.length));
  }

  private _isLoading = false;

  get environments(): Array<any> {
    return this._environments;
  }
  private _environments: Array<any>;

  getUserById(id: number): Observable<any> {
    return id ? this.http.get(`${this._userUrl}/${id}`) : of(this.getDefault());
  }

  loadUser(id: number): void {
    this._isLoading = true;
    forkJoin(
      this.getUserById(id),
      this.http.get(this._projectUrltUrl)
    ).subscribe(([user, projects]: any) => {
      this._user = user.data;
      this._environments = projects.data;
      this._environments.forEach(x => {
        x.isChecked = false,
          x.role = 1,
          x.data = 1,
          x.kf = 4
        x.isShowAdvanced = false
      });
      this._isLoading = false;
    });
  }

  resetService(id: any): void {
    this._selectedTab = 0;
    this.resetValidation();
    this.loadUser(id);
  }

  isHasChanges(): boolean {
    return true;
  }

  getDefault(): any {
    // return {
    //   isSuperAdmin: false,
    //   enabled: true,
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   phone: ''
    // }
    return {
      data: {
        id: "0",
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
        domain: "",
        photo: undefined,
        enabled: true,
        permissionSets: []
      }
    };
  }

  cancelConfirm(): void {
    this.showCancelConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/users');
  }


  private _selectedTab = 0;
  get selectedTab(): number { return this._selectedTab; }

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

  private _isNeedValidate = !true;

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }

    this.resetValidation();
    let res = true;
    Object.keys(this.missingItem).forEach(k => {
      if (this.isEmpty(this.user[k])) {
        this.missingItem[k].isMissing = true;
        this.missingItem[k].isError = true;
        res = false;
      }
    });
    return res;
  }

  private isEmpty(value: any): boolean {
    if (!value) { return true; }
    return value.toString().trim() === '';
  }

  resetValidation(): void {
    Object.keys(this.missingItem).forEach(k => {
      this.missingItem[k].isMissing = false;
      this.missingItem[k].isError = false;
    });
  }

  cancel(): void {
    this.navigationService.navigate('/users');
  }

  save(): void {

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
      ],
      rows: []
    }
    this._user.permissionSets.forEach((fl, i) => {
      data.rows.push({
        cells: {
          PermissionSetName: fl.setName,
          Environment: fl.projectName,
          ApprovalKey: fl.keyName,
          KeyStatus: 'New',
          Active: fl.isActive,
          maxPatients: fl.size,
          startDate: fl.fromDate,
          endDate: fl.toDate
          // PermissionTemplate: fl.researchTemplates ? fl.researchTemplates.map((t: any) => {
          //   return t.template ? t.template.templateName : ''
          // }).join(';') : '',
          // Allowedcontent: fl.researchRestrictionEvents ? fl.researchRestrictionEvents.map((e: any) => {
          //   return e.siteEventPropertyInfo ? `[(${e.siteEventInfo ? e.siteEventInfo.eventTableAlias : 'null'}) (${e.eventPropertyId}) (${e.value})]` : ''
          // }).join(';') : ';',
          // approvalKeyExpirationDate: fl.approvalKeyExpirationDate || ''
        },
        source: fl,
        isActive: true
      })
    })
    return data;
  }


}
