import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { forkJoin, Subject, Observable, timer, of } from 'rxjs';
import { UserListService } from './user-list.service';
import { DateService, BaseSibscriber, NotificationsService, ToasterType } from '@appcore';
import { ConfigService } from '@app/shared/services/config.service';
import { Router } from '@angular/router';

export const AllowedEvents = [
  { id: 1, text: 'No allowed events (Default)' },
  { id: 2, text: 'All events' },
  { id: 3, text: 'Events based on permission templates:' }
]

export class PermissionSet {
  isNew: boolean;
  isActive: boolean;
  setName: string;
  setDescription: string;
  size?: number;
  fromDateUnlimited?: boolean;
  toDateUnlimited?: boolean;
  fromDate?: Date;
  toDate?: Date;
  keyExpirationDate?: Date;
  keyName: string;
  project: any;
  fromSetId?: any;
  userId?: any;
  allowedEvent: number;
  researchTemplates: Array<any>;
  researchRestrictionEvents: Array<any>;
  roleItems: Array<any>;
  data: {
    researchStatus?: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionSetService extends BaseSibscriber {

  constructor(
    private http: HttpClient,
    private userListService: UserListService,
    private dateService: DateService,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationsService,
  ) {
    super();
  }

  get onTemplatesLoaded(): Observable<void> {
    return this._onTemplatesLoaded.asObservable();
  }
  private _onTemplatesLoaded = new Subject<void>();

  private _setId: any;

  @Offline('assets/offline/selectedResearch.json?')
  private _setUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  loadSet(): Observable<any> {
    if (!this._setId) {
      return of(this.getDefault());
    }
    return this.http.get(`${this._setUrl}/${this._setId}`);
  }

  cloneSet(setObj: any): void {
    const permSet = this.researchers.find(x => x.researchId === setObj.researchId);
    if (permSet) {
      this._permissionSet = this.convertToClient(permSet);
      this._permissionSet.isNew = false;
      this.initTemplates(permSet);
    }
  }

  resetService(id: any): void {
    this._setId = id;
    this.loadData();
    this.user = undefined;
    this._isShowError = false;
    this._selectedTab = 0;
  }

  private _templatesLoaded = false;
  get templatesLoaded(): boolean {
    return this._templatesLoaded;
  }

  @Offline('assets/offline/templateByProject.json?')
  private templateByProjectUrl = `${environment.serverUrl}${environment.endPoints.templateByProject}`;

  loadTemplates(): void {
    this._templatesLoaded = false;
    this.http.get(`${this.templateByProjectUrl}/${this.permissionSet.project}`).subscribe((res: any) => {
      this._templatesLoaded = true;
      this.templates = res.data.map((t: any) => {
        return {
          name: t.templateName,
          id: t.templateId,
          isChecked: false,
          templateItems:
            t.siteEventInfos.map((ti: any) => {
              return { name: ti.eventTableName, type: ti.eventType };
            })
        }
      });
      this._onTemplatesLoaded.next();
    });
  }

  templates = [];
  user: any;

  updateTemplates(): void {
    this.templates = [].concat(this.templates);
    this._permissionSet.researchTemplates =
      this.templates.filter(x => x.isChecked).map(x => {
        return {
          templateId: x.id
        }
      })
  }

  get onTabChanged(): Observable<number> {
    return this._onTabChanged.asObservable();
  }
  private _onTabChanged = new Subject<number>();

  private _selectedTab = 0;
  get selectedTab(): number { return this._selectedTab; }

  setTab(i: number): void {
    if (!this.validate(false)) { return; }
    this._selectedTab = i;
    this._onTabChanged.next(this._selectedTab);
  }

  nextTab(i: number): void {
    if (!this.validate(true)) { return; }
    this._selectedTab += i;
    if (this._selectedTab < 0) { this._selectedTab = 0; }
    if (this._selectedTab > 2) { this._selectedTab = 2; }
    this._onTabChanged.next(this._selectedTab);
  }

  cancel(): void {
    this.router.navigateByUrl('/users/research');
  }

  save(): void {
    const obj = this.createSaveObject();
    if (this._setId) {
      this.http.put(`${environment.serverUrl}${environment.endPoints.research}/${this._setId}`, obj).subscribe(res => {
        this.router.navigateByUrl('/users/research');
      }, error => {
        this.notificationService.addNotification({
          type: ToasterType.error,
          name: 'Failed to save research',
          comment: 'Try again or contact MDClone support.',
          showInToaster: true
        });
      });
    } else {
      this.http.post(`${environment.serverUrl}${environment.endPoints.research}`, obj).subscribe(res => {
        this.router.navigateByUrl('/users/research');
      }, error => {
        this.notificationService.addNotification({
          type: ToasterType.error,
          name: 'Failed to add research',
          comment: 'Try again or contact MDClone support.',
          showInToaster: true
        });
      });
    }
  }

  private createSaveObject(): any {
    const obj = {
      researchName: this.permissionSet.setName,
      userId: this.permissionSet.userId,
      information: this.permissionSet.setDescription,
      approvalKey: this.permissionSet.keyName,
      projectId: this.permissionSet.project,
      researchStatus: "Open",
      maxPatients: this.permissionSet.size,
      researchRestrictionEvents: []
    }
    if (this.permissionSet.keyExpirationDate) {
      obj['approvalKeyExpirationDate'] = this.dateService.formatDate(this.permissionSet.keyExpirationDate);
    }
    if (!this.permissionSet.fromDateUnlimited) {
      obj['startDate'] = this.dateService.formatDate(this.permissionSet.fromDate);
    }
    if (!this.permissionSet.toDateUnlimited) {
      obj['endDate'] = this.dateService.formatDate(this.permissionSet.toDate);
    }
    if (this.permissionSet.allowedEvent === 1) {
      obj.researchStatus = 'initial';
    } else {
      obj['researchTemplates'] =
        this.permissionSet.allowedEvent === 3 ?
          this.permissionSet.researchTemplates :
          this.templates.map(x => {
            return {
              templateId: x.id
            }
          })
    }

    // const checkedTemplates = this.templates.filter(x => x.isChecked);

    // checkedTemplates.forEach(x => {
    //   x.siteEventInfos.forEach(y => {
    //     obj.researchRestrictionEvents.push({
    //       eventId: y.eventId,
    //       eventPropertyName: y.eventTableName,
    //       value: 1
    //     })
    //   })
    // })
    return obj;
  }

  private _isNeedValidate = true;

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }

    if (setError) {
      this._isShowError = true;
    }
    if (!this._permissionSet.isNew && this.isEmpty(this._permissionSet.fromSetId)) { return false; }
    if (this.isEmpty(this._permissionSet.userId)) { return false; }
    if (this.isEmpty(this._permissionSet.project)) { return false; }
    if (this.isEmpty(this._permissionSet.setName)) { return false; }

    if (!this._permissionSet.size) { return false; }

    if (!this._permissionSet.fromDateUnlimited && !this.dateService.isDateValid(this._permissionSet.fromDate)) { return false; }
    if (!this._permissionSet.toDateUnlimited && !this.dateService.isDateValid(this._permissionSet.toDate)) { return false; }

    //if (!this.dateService.isDateValid(this._permissionSet.keyExpirationDate)) { return false; }

    //if (this.isEmpty(this._permissionSet.keyName)) { return false; }

    this._isShowError = false;
    return true;
  }

  private isEmpty(value: any): boolean {
    if (!value) { return true; }
    if (value.toString().trim() === '') { return true; }
    return false;
  }

  private _permissionSet: PermissionSet;
  private _dataLoaded = false;
  private _researchers: Array<any>;
  private _users: Array<any>;
  private _isShowError = false;

  get isShowError(): boolean {
    return this._isShowError;
  }

  get permissionSet(): PermissionSet {
    return this._permissionSet;
  }

  get dataLoaded(): boolean {
    return this._dataLoaded;
  }

  get researchers(): Array<any> {
    return this._researchers;
  }

  get users(): Array<any> {
    return this._users;
  }


  getDefault(): PermissionSet {
    return {
      isNew: true,
      isActive: true,
      setName: '',
      size: parseInt(this.configService.getValue('research_max_patients')),
      setDescription: '',
      keyName: '',
      project: '',
      allowedEvent: 1,
      researchTemplates: [],
      researchRestrictionEvents: [],
      roleItems: [{
        name: 'test'
      }],
      data: {
      }
    }
  }

  @Offline('assets/offline/research.json')
  private getResearchUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  loadData(): void {
    this._dataLoaded = false;
    forkJoin(
      this.http.get(this.getResearchUrl),
      this.userListService.load(),
      this.loadSet()
    ).subscribe(([researchers, users, permSet]: any) => {
      this._researchers = researchers.data;
      this._users = users.data;
      if (this._setId) {
        this._permissionSet = this.convertToClient(permSet.data);
        this.initTemplates(permSet.data);
      } else {
        this._permissionSet = permSet;
      }
      this._dataLoaded = true;
    });
  }

  private initTemplates(permSet: any): void {
    super.add(this.onTemplatesLoaded.subscribe(() => {
      if (!permSet.researchTemplates || !permSet.researchTemplates.length) {
        this.permissionSet.allowedEvent = 1;
        return;
      }
      this.templates.forEach(t => {
        t.isChecked = permSet.researchTemplates.find((x: any) => x.templateId.toString() === t.id.toString());
      });
      this.permissionSet.allowedEvent = this.templates.find(x => !x.isChecked) ? 3 : 2;
    }))
    this.loadTemplates();
  }

  private convertToClient(permSet: any): PermissionSet {
    const res = this.getDefault();
    res.userId = permSet.userId;
    res.project = permSet.projectId;

    res.fromDate = permSet.startDate ? new Date(permSet.startDate) : undefined;
    res.fromDateUnlimited = !permSet.startDate;
    res.toDate = permSet.endDate ? new Date(permSet.endDate) : undefined;
    res.toDateUnlimited = !permSet.endDate;

    res.keyName = permSet.approvalKey;
    res.keyExpirationDate = new Date(permSet.approvalKeyExpirationDate);
    res.size = permSet.maxPatients;
    res.setName = permSet.researchName;
    res.setDescription = permSet.information;
    this.user = this._users.find(x => x.id === permSet.userId);
    if (this.user) {
      res.userId = this.user.id;
    }
    return res;
  }

  getResearchers(): Array<any> {
    return this._researchers.map((x: any) => {
      return {
        researchId: x.researchId,
        researchName: x.researchName,
        user: `${x.user.firstName} ${x.user.lastName}`,
        name: `${x.researchName} ${x.user.firstName} ${x.user.lastName}`
      };
    })
  }

  getUsers(): Array<any> {
    return this._users.map((x: any) => {
      return {
        id: x.id,
        name: `${x.firstName} ${x.lastName}`,
        projects: x.projects
      };
    })
  }

  addRoleItem(): void {
    this._permissionSet.roleItems = [{ name: '1' }].concat(this._permissionSet.roleItems)
  }

  removeRoleItem(item: any): void {
    this._permissionSet.roleItems = this._permissionSet.roleItems.filter(x => x !== item);
  }
}
