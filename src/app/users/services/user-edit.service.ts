import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService, DateService, NotificationsService } from '@appcore';
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
    }
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

  get securityType(): number {
    return this._securityType;
  }
  private _securityType: number;
  initSecurity(): void {
    this._securityType = parseInt(this.configService.getValue('security').toString());
  }

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
    return this._isLoading;
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
        photo: undefined
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

}
