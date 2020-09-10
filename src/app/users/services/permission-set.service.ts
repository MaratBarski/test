import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { forkJoin, Subject, Observable, timer, of } from 'rxjs';
import { UserListService } from './user-list.service';
import { DateService, BaseSibscriber, NotificationsService, ToasterType, INotification, NavigationService } from '@appcore';
import { ConfigService } from '@app/shared/services/config.service';
import { Router } from '@angular/router';

export const NO_ALLOWED_EVENTS = 1;
export const ALL_EVENTS = 2;
export const BASED_EVENTS = 3;

export const AllowedEvents = [
  { id: NO_ALLOWED_EVENTS, text: 'No allowed events (Default)' },
  { id: ALL_EVENTS, text: 'All events' },
  { id: BASED_EVENTS, text: 'Events based on permission templates:' }
]

export class PermissionSet {
  isNew: boolean;
  isActive: boolean;
  setName: string;
  setFullName: string;
  setDescription: string;
  size?: number;
  fromDateUnlimited?: boolean;
  toDateUnlimited?: boolean;
  fromDate?: Date;
  toDate?: Date;
  keyExpirationDate?: Date;
  keyName: string;
  project: any;
  projectName?: string;
  fromSetId?: any;
  fromSetName?: string;
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

  redirectUrl = '';
  showCancelConfirm = false;

  get onAllowedEventsChange(): Observable<any> {
    return this._onAllowedEventsChange;
  }
  private _onAllowedEventsChange = new Subject();

  get maxSize(): number {
    return this._maxSize;
  }
  private _maxSize = 1;

  get isOfflineMode(): boolean {
    return this._isOfflineMode;
  }
  private _isOfflineMode = false;

  setOffline(ps: any): void {
    this._isOfflineMode = true;
    this._permissionSet = ps;
  }

  constructor(
    private http: HttpClient,
    private userListService: UserListService,
    private dateService: DateService,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationsService,
    private navigationService: NavigationService
  ) {
    super();
    this._maxSize = parseInt(this.configService.getValue('research_max_patients'));
  }

  cancelConfirm(): void {
    this.showCancelConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/users/research');
  }

  private _initialSet = {};

  private setInitialSet(): void {
    if (!this._permissionSet) { return; }
    this._initialSet = JSON.parse(JSON.stringify(this.createSaveObject()));
  }

  isHasChanges(): boolean {
    return JSON.stringify(this._initialSet) !== JSON.stringify(this.createSaveObject());
  }

  get isSetNameEmpty(): boolean {
    if (this._permissionSet.setName.trim() === '' && this.isAfterValidate) {
      return true;
    }
    return false;
  }

  get isUserEmpty(): boolean {
    if (!this._permissionSet.userId && this.isAfterValidate) {
      return true;
    }
    return false;
  }

  get isProjectEmpty(): boolean {
    if (!this._permissionSet.project && this.isAfterValidate) {
      return true;
    }
    return false;
  }

  get onTemplatesLoaded(): Observable<boolean> {
    return this._onTemplatesLoaded.asObservable();
  }
  private _onTemplatesLoaded = new Subject<boolean>();

  private _setId: any;

  @Offline('assets/offline/selectedResearch.json?')
  private _setUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  loadSet(): Observable<any> {
    if (!this._setId) {
      return of(this.getDefault());
    }
    return this.getSetById(this._setId);
  }

  getSetById(id: any): Observable<any> {
    return this.http.get(`${this._setUrl}/${id}`);
  }

  set fromSetId(id: number) {
    this._fromSetId = id;
  }
  get fromSetId(): number {
    return this._fromSetId;
  }
  private _fromSetId = 0;

  cloneSet(setObj: any): void {
    this._fromSetId = setObj.researchId;
    this._permissionSet.fromSetId = setObj.researchId;
    const permSet = this.researchers.find(x => x.researchId === setObj.researchId);
    if (permSet) {
      this._permissionSet = this.convertToClient(permSet);
      this._permissionSet.isNew = false;
      this.initTemplates(permSet);
    }
  }

  changeSource(): void {
    this._permissionSet.keyName = '';
    this._permissionSet.project = '';
    this._permissionSet.researchRestrictionEvents = [];
    this._permissionSet.size = parseInt(this.configService.getValue('research_max_patients'));
    this._permissionSet.allowedEvent = NO_ALLOWED_EVENTS;
    this._permissionSet.setName = '';
    this._permissionSet.setFullName = '';
    this._permissionSet.roleItems = [];
    this._permissionSet.researchTemplates = [];
    this._permissionSet.isActive = true;
    this._permissionSet.setDescription = '';
    this._permissionSet.keyName = '';
    this._permissionSet.keyExpirationDate = undefined;
    this._fromSetId = 0;
    // this._permissionSet.fromDateUnlimited = false;
    // this._permissionSet.toDateUnlimited = false;
    // this._permissionSet.fromDate = undefined;
    // this._permissionSet.toDate = undefined;
    this.user = undefined;
  }

  get isEditMode(): boolean {
    return !!this._setId;
  }

  isPopup = false;

  resetService(id: any): void {
    this.isPopup = false;
    this._fromSetId = 0;
    this.isAfterValidate = false;
    this._permissionSet = this.getDefault();
    this.addedEvents = [];
    this._setId = id;
    this.loadData();
    this.user = undefined;
    this._isShowError = false;
    this._selectedTab = 0;
    this.setInitialSet();
    this._onAllowedEventsChange.next();
  }

  private _templatesLoaded = false;
  get templatesLoaded(): boolean {
    return this._templatesLoaded;
  }

  @Offline('assets/offline/templateByProject.json?')
  private templateByProjectUrl = `${environment.serverUrl}${environment.endPoints.templateByProject}`;

  @Offline('assets/offline/siteEventPropertyInfos.json?')
  private siteEventInfoUrl = `${environment.serverUrl}${environment.endPoints.siteEventInfo}`;

  private findEventType(templateInfo: any, dataTemplates: Array<any>): string {
    if (!dataTemplates || !dataTemplates.length) { return ''; }
    const templates = dataTemplates.filter(t => t.templateType === 'DISPLAY');
    for (let i = 0; i < templates.length; i++) {
      if (!templates[i].siteEventInfos) { continue; }
      for (let j = 0; j < templates[i].siteEventInfos.length; j++) {
        if (templates[i].siteEventInfos[j].eventId === templateInfo.eventId) {
          //return templates[i].siteEventInfos[j].eventTableAlias;
          return templates[i].templateName;
        }
      }
    }
    return '';
  }

  loadTemplates(isInitTemplates: boolean): void {
    setTimeout(() => { this._templatesLoaded = false; }, 1);
    const subscribbtion =
      forkJoin(
        this.http.get(`${this.templateByProjectUrl}/${this.permissionSet.project}`),
        this.http.get(`${this.siteEventInfoUrl}/${this.permissionSet.project}`),
      ).subscribe(([res, events]: any) => {
        setTimeout(() => { this._templatesLoaded = true; }, 2);
        subscribbtion.unsubscribe();
        this.templates = res.data
          .filter((t: any) => t.templateType === 'PERMISSION')
          .map((t: any) => {
            return {
              name: t.templateName,
              id: t.templateId,
              isChecked: false,
              templateItems:
                t.siteEventInfos.map((ti: any) => {
                  return {
                    name: ti.eventTableAlias,
                    type: this.findEventType(ti, res.data)
                  };
                })
            }
          });
        this.initRoleEventItems(events.data);
        this._onTemplatesLoaded.next(isInitTemplates);
      });
  }

  events = [];
  addedEvents = [];

  private initRoleEventItems(events: Array<any>): void {
    this._permissionSet.roleItems = [];
    this.events = events;
  }

  addEvent(): void {
    this.addedEvents = this.addedEvents.concat({
      target: {
        eventId: -1,
        eventPropertyId: '',
        value: ''
      },
      list: [].concat(this.events)
    });
  }

  removeRoleItem(item: any): void {
    this.addedEvents = this.addedEvents.filter(x => x !== item);
  }

  templates = [];
  user: any;

  selectTemplates(): void {
    if (!this.permissionSet.researchTemplates || !this.permissionSet.researchTemplates.length) { return; }
    this.templates.forEach(t => {
      t.isChecked = !!this.permissionSet.researchTemplates.find((x: any) => x.templateId.toString() === t.id.toString());
    });
    this.templates = [].concat(this.templates);
  }

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
    this.isAfterValidate = true;
    if (!this.validate(false)) { return; }
    this.isAfterValidate = false;
    this._selectedTab = i;
    this._onTabChanged.next(this._selectedTab);
  }

  nextTab(i: number): void {
    this.isAfterValidate = true;
    if (!this.validate(true)) { return; }
    this.isAfterValidate = false;
    this._selectedTab += i;
    if (this._selectedTab < 0) { this._selectedTab = 0; }
    if (this._selectedTab > 2) { this._selectedTab = 2; }
    this._onTabChanged.next(this._selectedTab);
  }

  cancel(): void {
    this.navigationService.navigate('/users/research');
  }

  isSaving = false;
  selectedProject: any;

  getSet(): any {
    this.isAfterValidate = true;
    if (!this.validate(true)) { return undefined; }
    this.permissionSet.researchRestrictionEvents = this.createRestrictionEvents();
    return { ps: this.permissionSet, researcher: this.createSaveObject() };
  }

  save(): void {
    this.isAfterValidate = true;
    if (!this.validate(true)) { return; }
    const obj = this.createSaveObject();
    //document.write(JSON.stringify(obj));
    this.isSaving = true;
    if (this.isEditMode) {
      this.updateSet(obj);
    } else {
      this.addSet(obj);
    }
  }

  private addSuccNotification(): void {
    this.isSaving = false;
    this.notificationService.addNotification({
      type: ToasterType.success,
      name: 'Permission set created  successfully.',
      comment: 'The user can now query the allowed data.',
      showInToaster: true
    });
  }

  private updateSet(obj: any): void {
    const subscribtion = this.http.put(`${environment.serverUrl}${environment.endPoints.research}/${this._setId}`, obj).subscribe(res => {
      subscribtion.unsubscribe();
      this.router.navigateByUrl('/users/research');
      this.addSuccNotification();
    }, error => {
      this.isSaving = false;
      this.notificationService.addNotification({
        type: ToasterType.error,
        name: 'Failed to update the permission set.',
        comment: 'Try again or contact MDClone support.',
        showInToaster: true
      });
    });
  }

  private addSet(obj: any): void {
    const subscribtion = this.http.post(`${environment.serverUrl}${environment.endPoints.research}`, obj).subscribe(res => {
      subscribtion.unsubscribe();
      this.router.navigateByUrl('/users/research');
      this.addSuccNotification();
    }, error => {
      this.isSaving = false;
      this.notificationService.addNotification({
        type: ToasterType.error,
        name: 'Failed to create the permission set.',
        comment: 'Try again or contact MDClone support.',
        showInToaster: true
      });
    });
  }

  private createRestrictionEvents(): Array<any> {
    return this.addedEvents
      .filter(ev => {
        return ev.target.eventId >= 0 &&
          ev.target.eventPropertyId &&
          ev.target.eventPropertyId.trim() !== '' &&
          ev.target.value &&
          ev.target.value.trim() !== '';
      })
      .map(ev => {
        return {
          eventId: ev.target.eventId,
          eventPropertyName: ev.target.eventPropertyId,
          value: ev.target.value
        }
      })
  }

  private createSaveObject(): any {
    const obj = {
      researchName: this.permissionSet.setName,
      userId: this.permissionSet.userId,
      projectId: this.permissionSet.project,
      researchStatus: "Open",
      maxPatients: this.permissionSet.size,
      researchRestrictionEvents: this.createRestrictionEvents()
    }
    this.addField(obj, 'information', this.permissionSet.setDescription);
    this.addField(obj, 'approvalKey', this.permissionSet.keyName);

    if (this.permissionSet.keyExpirationDate) {
      obj['approvalKeyExpirationDate'] = this.dateService.formatDateToSend(this.permissionSet.keyExpirationDate);
    }
    if (!this.permissionSet.fromDateUnlimited) {
      obj['startDate'] = this.dateService.formatDateToSend(this.permissionSet.fromDate);
    }
    if (!this.permissionSet.toDateUnlimited) {
      obj['endDate'] = this.dateService.formatDateToSend(this.permissionSet.toDate);
    }
    if (this.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      obj.researchStatus = 'initial';
    } else if (this.permissionSet.allowedEvent === BASED_EVENTS) {
      obj['researchTemplates'] = this.permissionSet.researchTemplates;
    }
    return obj;
  }

  private addField(obj: any, name: string, value: any): void {
    if (!value) { return; }
    obj[name] = value;
  }

  private _isNeedValidate = true;
  isAfterValidate = false;

  validate(setError: boolean): boolean {
    if (!this._isNeedValidate) { return true; }

    if (setError) {
      this._isShowError = true;
    }
    //if (!this._permissionSet.isNew && this.isEmpty(this._permissionSet.fromSetId)) { return false; }
    if (this.isEmpty(this._permissionSet.userId) && !this.isPopup) { return false; }
    if (this.isEmpty(this._permissionSet.project)) { return false; }
    if (this.isEmpty(this._permissionSet.setName)) { return false; }

    if (!this._permissionSet.size) { return false; }

    if (!this._permissionSet.fromDateUnlimited && !this.dateService.isDateValid(this._permissionSet.fromDate)) { return false; }
    if (!this._permissionSet.toDateUnlimited && !this.dateService.isDateValid(this._permissionSet.toDate)) { return false; }

    if (!this.permissionSet.isNew && !this._fromSetId) { return false; }
    //if (!this.dateService.isDateValid(this._permissionSet.keyExpirationDate)) { return false; }

    //if (this.isEmpty(this._permissionSet.keyName)) { return false; }

    let invalidRoles = false;
    this.addedEvents.forEach(ev => {
      if (ev.target.eventId === -1 ||
        !ev.target.eventPropertyId ||
        ev.target.eventPropertyId.trim() === '' ||
        !ev.target.value ||
        ev.target.value.trim() === '') {
        invalidRoles = true;
        return;
      }
    });

    if (invalidRoles) { return false; }

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

  get showWarning(): boolean {
    if (!this._permissionSet.keyExpirationDate) { return false; }
    return new Date() > this._permissionSet.keyExpirationDate;
  }

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

  addEvents(): void {
    this.addedEvents = [];
    if (!this.permissionSet.researchRestrictionEvents || !this.permissionSet.researchRestrictionEvents.length) { return; }
    this.initEvents(this.permissionSet);
  }

  getDefault(): PermissionSet {
    const res = {
      userId: 0,
      isNew: true,
      isActive: true,
      setName: '',
      setFullName: '',
      size: parseInt(this.configService.getValue('research_max_patients')),
      setDescription: '',
      keyName: '',
      project: '',
      allowedEvent: NO_ALLOWED_EVENTS,
      researchTemplates: [],
      researchRestrictionEvents: [],
      roleItems: [],
      data: {
      }
    };

    this.addDateValue(res, 'research_start_date', 'fromDate', 'fromDateUnlimited');
    this.addDateValue(res, 'research_end_date', 'toDate', 'toDateUnlimited');

    return res;
  }

  private addDateValue(obj: any, configName: string, propertyName: string, checkPropertyName: string): void {
    const dateStr = this.configService.getValue(configName);
    if (!dateStr) {
      obj[checkPropertyName] = true;
      return;
    }
    const date = new Date(dateStr);
    if (this.dateService.isDateValid(date)) {
      obj[propertyName] = date;
      obj[checkPropertyName] = false;
    } else {
      obj[checkPropertyName] = true;
    }
  }

  @Offline('assets/offline/research.json')
  private getResearchUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  loadData(): void {
    this._dataLoaded = false;
    const subsciption = forkJoin(
      this.http.get(this.getResearchUrl),
      this.userListService.load(),
      this.loadSet()
    ).subscribe(([researchers, users, permSet]: any) => {
      subsciption.unsubscribe();
      this._researchers = researchers.data;
      this._users = users.data;
      if (this._setId) {
        this._permissionSet = this.convertToClient(permSet.data);
        this.initTemplates(permSet.data);
      } else if (!this._isOfflineMode) {
        this._permissionSet = permSet;
        this.templates = [];
      }
      this._dataLoaded = true;
      this.setInitialSet();
      this._isOfflineMode = false;
    });
  }

  private initEvents(ps: any): void {
    this.addedEvents = [];
    if (!ps.researchRestrictionEvents || !ps.researchRestrictionEvents.length) { return; }
    ps.researchRestrictionEvents.forEach(ev => {
      const event = this.events.find(x => x.eventId === ev.eventId);
      if (!event) { return; }
      this.addedEvents.push({
        target: {
          eventId: ev.eventId,
          eventPropertyId: ev.eventPropertyName,
          value: ev.value
        },
        list: [].concat(this.events)
      })
    });
  }

  private initTemplates(permSet: any): void {
    const subsciption = this.onTemplatesLoaded.subscribe((flag: boolean) => {
      subsciption.unsubscribe();
      if (this.isEditMode) {
        this.initEvents(permSet);
        if (permSet.researchStatus && permSet.researchStatus.toLowerCase() === 'open') {
          if (!permSet.researchTemplates || !permSet.researchTemplates.length) {
            this.permissionSet.allowedEvent = ALL_EVENTS;
          }
          if (permSet.researchTemplates && permSet.researchTemplates.length) {
            this.permissionSet.allowedEvent = BASED_EVENTS;
          }
        }
        if (permSet.researchStatus && permSet.researchStatus.toLowerCase() === 'initial') {
          this.permissionSet.allowedEvent = NO_ALLOWED_EVENTS;
        } else if (permSet.researchTemplates) {
          this.templates.forEach(t => {
            t.isChecked = !!permSet.researchTemplates.find((x: any) => x.templateId.toString() === t.id.toString());
          });
        }
        this.setInitialSet();
        this._onAllowedEventsChange.next();
      } else {
        // TO-DO update templates by set
      }
    });
    this.loadTemplates(true);
  }

  convertToClient(permSet: any): PermissionSet {
    const res = this.getDefault();
    res.userId = permSet.userId;
    res.project = permSet.projectId;

    res.fromDate = permSet.startDate ? new Date(permSet.startDate) : undefined;
    res.fromDateUnlimited = !permSet.startDate;
    res.toDate = permSet.endDate ? new Date(permSet.endDate) : undefined;
    res.toDateUnlimited = !permSet.endDate;
    res.isActive = permSet.researchStatus &&
      (permSet.researchStatus.toLowerCase() === 'open' || permSet.researchStatus.toLowerCase() === 'initial');

    res.keyName = permSet.approvalKey;
    if (permSet.approvalKeyExpirationDate) {
      res.keyExpirationDate = new Date(permSet.approvalKeyExpirationDate);
    } else {
      permSet.approvalKeyExpirationDate = undefined;
    }
    res.size = permSet.maxPatients;
    res.setName = permSet.researchName;
    res.setFullName = `${permSet.researchName} - ${permSet.user.firstName} ${permSet.user.lastName}`;
    res.setDescription = permSet.information;
    if (this._users && this._users.length) {
      this.user = this._users.find(x => x.id === permSet.userId);
      if (this.user) {
        res.userId = this.user.id;
      }
      this._onAllowedEventsChange.next();
    }
    return res;
  }

  getResearchers(): Array<any> {
    return this._researchers.map((x: any) => {
      return {
        researchId: x.researchId,
        researchName: x.researchName,
        user: `${x.user.firstName} ${x.user.lastName}`,
        name: `${x.researchName} - ${x.user.firstName} ${x.user.lastName}`
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


  updateAllowedEvents(): void {
    if (this.permissionSet.allowedEvent === ALL_EVENTS) {
      this.templates.forEach(x => x.isChecked = true);
    } else if (this.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      this.templates.forEach(x => x.isChecked = false);
    }
    this.updateTemplates();
    this._onAllowedEventsChange.next();
  }
}
