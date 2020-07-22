import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { forkJoin, Subject, Observable, timer } from 'rxjs';
import { UserListService } from './user-list.service';
import { DateService } from '@app/core-api';

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
  data: {
    researchStatus?: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionSetService {

  constructor(
    private http: HttpClient,
    private userListService: UserListService,
    private dateService: DateService
  ) {
    this._permissionSet = this.getDefault();
    this.loadData();
  }

  private _templatesLoaded = false;
  get templatesLoaded(): boolean {
    return this._templatesLoaded;
  }

  loadTemplates(): void {
    this._templatesLoaded = false;
    timer(1000).subscribe(() => {
      this._templatesLoaded = true;
      this.templates = [
        {
          name: 'template1', id: 1, isChecked: false, templateItems: [
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' }
          ]
        },
        {
          name: 'template2', id: 2, isChecked: false, templateItems: [
            { name: 'Medications in Admissions', type: 'Medications' }
          ]
        },
        {
          name: 'template3', id: 3, isChecked: false, templateItems: [
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' }
          ]
        },
        {
          name: 'template4', id: 4, isChecked: false, templateItems: [
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' },
            { name: 'Medications in Admissions', type: 'Medications' }
          ]
        }
      ];
    });
  }

  templates = [];

  updateTemplates(): void {
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

  cansel(): void {

  }

  save(): void {

  }

  private _isNeedValidate = false;

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

    if (!this.dateService.isDateValid(this._permissionSet.keyExpirationDate)) { return false; }

    if (this.isEmpty(this._permissionSet.keyName)) { return false; }

    this._isShowError = false;
    return true;
  }

  private isEmpty(value: any): boolean {
    if (!value) { return true; }
    if (value.trim() === '') { return true; }
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
      size: undefined,
      setDescription: '',
      keyName: '',
      project: '',
      allowedEvent: 1,
      researchTemplates: [],
      researchRestrictionEvents: [],
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
      this.userListService.load()
    ).subscribe(([researchers, users]: any) => {
      this._researchers = researchers.data;
      this._users = users.data;
      this._dataLoaded = true;
    });
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
        name: `${x.firstName} ${x.lastName}`
      };
    })
  }

}
