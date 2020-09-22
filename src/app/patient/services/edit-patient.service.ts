import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, NotificationsService } from '@appcore';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { ConfigService } from '@app/shared/services/config.service';
import { environment } from '@env/environment';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OutputFormats } from '../models/models';
import { LoginService } from '@appcore';

@Injectable({
  providedIn: 'root'
})
export class EditPatientService {

  get onQueriesLoded(): Observable<any> { return this._onQueriesLoded; }
  private _onQueriesLoded = new Subject();

  get onHierarchyProjects(): Observable<any> { return this._onHierarchyProjects; }
  private _onHierarchyProjects = new Subject();

  private _filters = [
    [false, false, false, false, false, false, false],
    [false, false, false],
  ]

  getFilterCount(i: number): string {
    const c = this._filters[i].filter(x => x).length;
    return c ? `${c}` : 'None';
  }

  getRegexCount(): string {
    return this.regexes.length ? `${this.regexes.length}` : 'None';
  }

  set isPhoneItemChecked(f: boolean) { this._filters[0][0] = f; }
  get isPhoneItemChecked(): boolean { return this._filters[0][0]; }

  set isZipCodeChecked(f: boolean) { this._filters[0][1] = f; }
  get isZipCodeChecked(): boolean { return this._filters[0][1]; }

  set isOldPatientsChecked(f: boolean) { this._filters[0][2] = f; }
  get isOldPatientsChecked(): boolean { return this._filters[0][2]; }

  set isExtraYearsChecked(f: boolean) { this._filters[0][3] = f; }
  get isExtraYearsChecked(): boolean { return this._filters[0][3]; }

  set isEmailChecked(f: boolean) { this._filters[0][4] = f; }
  get isEmailChecked(): boolean { return this._filters[0][4]; }

  set isIpChecked(f: boolean) { this._filters[0][5] = f; }
  get isIpChecked(): boolean { return this._filters[0][5]; }

  set isUrlChecked(f: boolean) { this._filters[0][6] = f; }
  get isUrlChecked(): boolean { return this._filters[0][6]; }

  set isMaxDateShiftingChecked(f: boolean) { this._filters[1][0] = f; }
  get isMaxDateShiftingChecked(): boolean { return this._filters[1][0]; }

  set isMaxNumericStringChecked(f: boolean) { this._filters[1][1] = f; }
  get isMaxNumericStringChecked(): boolean { return this._filters[1][1]; }

  set isFreeTextChecked(f: boolean) { this._filters[1][2] = f; }
  get isFreeTextChecked(): boolean { return this._filters[1][2]; }

  hipaa_date_shift = 0;
  general_numeric_shift = 0;
  general_date_shift = 0;

  regexes = [];

  removeRegex(r: any): void {
    this.regexes = this.regexes.filter(x => x !== r);
  }

  addRegex(): void {
    this.regexes.push({
      name: '',
      value: ''
    });
  }

  get outputFormatName(): string {
    // const res = OutputFormats.find(x => x.id === this.settings.outputFormat);
    // return res ? res.text : '';
    return OutputFormats[this.settings.outputFormat].text;
  }

  get dataLoaded(): boolean { return this._dataLoaded; }
  private _dataLoaded = true;

  get selectedTab(): number { return this._selectedTab; }
  private _selectedTab = 0;

  get isShowError(): boolean { return this._isShowError; }
  private _isShowError = false;

  get isProjectSelected(): boolean { return this._isProjectSelected; }
  private _isProjectSelected = true;

  get isNameSetted(): boolean { return this._isNameSetted; }
  private _isNameSetted = true;

  get isQuerySelected(): boolean { return this._isQuerySelected; }
  private _isQuerySelected = true;

  get isFileSelected(): boolean { return this._isFileSelected; }
  private _isFileSelected = true;

  file: any;

  resetValidation(): void {
    this._isProjectSelected = true;
    this._isNameSetted = true;
    this._isQuerySelected = true;
    this._isFileSelected = true;
    this._isShowError = false;
  }

  validate(): boolean {
    this.resetValidation();
    //return true;
    let error = true;
    if (!this._settings.projectId) {
      error = this._isProjectSelected = false;
    }
    if (!this._settings.settingsName || !this._settings.settingsName.trim()) {
      error = this._isNameSetted = false;
    }
    if (this._settings.cohortSource === 1 && !this._settings.queryId) {
      error = this._isQuerySelected = false;
    }
    if (this._settings.cohortSource === 2 && !this.file) {
      error = this._isFileSelected = false;
    }
    this._isShowError = !error;
    return error;
  }

  get settings(): any { return this._settings; }
  private _settings: any;

  queryName = '';
  projectName = '';

  get queries(): Array<any> { return this._queries; }
  private _queries: Array<any>;

  get hierarchyProjects(): Array<any> { return this._hierarchyProjects; }
  private _hierarchyProjects: Array<any>;
  get isHierarchyProjectsaded(): boolean { return this._isHierarchyProjectsaded; }
  private _isHierarchyProjectsaded = false;

  setHierarchyProjects(): void {
    this._isHierarchyProjectsaded = false;
    this.http.get(`${this.getHierarchyProjectUrl}/${this.settings.projectId}`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this._isHierarchyProjectsaded = true;
        this._hierarchyProjects = res.data;
        // this._hierarchyProjects.forEach(p=>{
        //   p.selectedId = 3478;
        // })
        this._onHierarchyProjects.next();
      }, error => {
        this._isHierarchyProjectsaded = true;
      })
  }

  getDefault(): any {
    return {
      data: {
        settingsName: '',
        projectId: 0,
        outputFormat: 0,
        cohortSource: 1,
        queryId: 0
      }
    };
  }

  loadSettings(): Observable<any> {
    if (this.storyId) {
      return this.http.get(this.getStoriiesUrl)
        .pipe(
          take(1),
          map((res: any) => {
            return res.data.find(x => x.lifeFluxTransId == this.storyId);
          })
        )
    }
    return of(this.getDefault());
  }

  loadQueries(projectId: number): Observable<any> {
    return this.http.get(`${this.queriesoUrl}/${projectId}`);
  }

  get isQuryLoaded(): boolean { return this._isQuryLoaded; }
  private _isQuryLoaded = false;

  setQueries(): void {
    this._isQuryLoaded = false;
    this.loadQueries(this.settings.projectId)
      .pipe(take(1))
      .subscribe(res => {
        this._isQuryLoaded = true;
        this.settings.queryId = 0;
        this.queryName = '';
        this._queries = res.data;
        this._onQueriesLoded.next();
      }, error => {
        this._isQuryLoaded = true;
      })
  }

  @Offline('assets/offline/siteEventPropertyInfos.json?')
  private siteEventInfoUrl = `${environment.serverUrl}${environment.endPoints.siteEventInfo}`;

  @Offline('assets/offline/userSession.json?')
  private queriesoUrl = `${environment.serverUrl}${environment.endPoints.patientStoryUserSession}`;

  @Offline('assets/offline/patientStory.json')
  private getStoriiesUrl = `${environment.serverUrl}${environment.endPoints.patientStory}`;

  @Offline('assets/offline/hierarchyProject.json?')
  private getHierarchyProjectUrl = `${environment.serverUrl}${environment.endPoints.hierarchyProject}`;

  setTab(tab: number): void {
    if (!this.validate()) { return; }
    this._selectedTab = tab;
  }

  setNextTab(i: number): void {
    if (!this.validate()) { return; }
    this._selectedTab += i;
  }

  get events(): Array<any> { return this._events; }
  private _events: Array<any>;

  loadEvents(): void {
    this._events = undefined;
    this.http.get(`${this.siteEventInfoUrl}/${this.settings.projectId}`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this._events = res.data;
        this._events.forEach(ev => {
          ev.isChecked = false;
          ev.siteEventPropertyInfos.forEach(se => {
            se.isChecked = ev.isChecked;
          });
        })
      }, error => {

      })
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationsService,
    private navigationService: NavigationService,
    private loginService: LoginService
  ) {
    // this.loginService.onUserInfoUpdated
    //   .subscribe(res => {
    //     alert(JSON.stringify(res.data.projects));
    //   })
    this.initCountries();
  }

  countries: Array<any> = [];
  selectedCountry = -1;

  private initCountries(): void {
    const c = JSON.parse(this.configService.getValue('hipaa_regex_phone'));
    this.countries = [];
    Object.keys(c).forEach((k, i) => {
      this.countries.push({
        text: k,
        value: c[k],
        id: i
      })
    });
  }

  get storyId(): number { return this._storyId; }
  _storyId = 0;

  reset(id: number = undefined): void {
    this._storyId = id;
    this._selectedTab = 0;
    this.isPhoneItemChecked = false;
    this.isZipCodeChecked = false;
    this.isOldPatientsChecked = false;
    this.isExtraYearsChecked = false;
    this.isEmailChecked = false;
    this.isIpChecked = false;
    this.isUrlChecked = false;
    this.isMaxDateShiftingChecked = false;
    this.isMaxNumericStringChecked = false;
    this.isFreeTextChecked = false;

    this.load();
  }

  load(): void {
    this._dataLoaded = false;
    forkJoin(
      this.loadSettings()
    )
      .pipe(take(1))
      .subscribe(([settings]: any) => {
        if (this.storyId) {
          this.convertToClient(settings)
        } else {
          this._settings = settings.data;
        }
        this._dataLoaded = true;
      }, error => {
        this._dataLoaded = true;
      });
  }

  convertToClient(settings): void {
    this._settings = this.getDefault();
    this._settings.settingsName = settings.name;
    this._settings.projectId = parseInt(`${settings.projectId}`);
    if (this._settings.projectId) {
      this.setQueries();
      this.setHierarchyProjects();
      const proj = this.loginService.findProject(this.settings.projectId);
      if (proj) {
        this.projectName = proj.projectName;
      }
    }
    this._settings.outputFormat = settings.outputType === 'files' ? 0 : 1;
    this._settings.cohortSource = settings.transJson.input_mode === 'session' ? 1 : 2;
    this._settings.queryId = 0;
    this.setIipaaInclusion(settings);
  }

  private setIipaaInclusion(settings: any): void {
    if (!settings.transJson) { return; }
    this.hipaa_date_shift = parseInt(`${settings.transJson.hipaa_date_shift || '0'}`);
    const dict = {
      phone: 'isPhoneItemChecked',
      zip: 'isZipCodeChecked',
      email: 'isEmailChecked',
      ip: 'isIpChecked',
      url: 'isUrlChecked',
      older_than_89: 'isOldPatientsChecked',
      date_shift: 'isExtraYearsChecked'
    };
    if (settings.transJson.hipaa_inclusion) {
      settings.transJson.hipaa_inclusion.split(',').forEach(str => {
        if (dict[str.toLowerCase().trim()]) {
          this[dict[str.toLowerCase().trim()]] = true;
        }
      });
    }

    this.general_date_shift = parseInt(`${settings.transJson.general_date_shift || '0'}`);
    this.general_numeric_shift = parseInt(`${settings.transJson.general_numeric_shift || '0'}`);
    this.isMaxDateShiftingChecked = !!this.general_date_shift;
    this.isMaxNumericStringChecked = !!this.general_numeric_shift;
    const phone = `${settings.transJson.hipaa_phone || ''}`;
    if (phone) {
      this.selectedCountry = this.countries.findIndex(x => x.value === phone);
    }

    this.isFreeTextChecked = settings.transJson.free_text;

  }
}
