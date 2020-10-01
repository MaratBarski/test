import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, NotificationsService, NotificationStatus, ToasterType } from '@appcore';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { ConfigService } from '@app/shared/services/config.service';
import { environment } from '@env/environment';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OutputFormats } from '../models/models';
import { LoginService } from '@appcore';
import { UploadService } from '@app/shared/services/upload.service';

@Injectable({
  providedIn: 'root'
})
export class EditPatientService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationsService,
    private navigationService: NavigationService,
    private loginService: LoginService,
    private uploadService: UploadService
  ) {
    this.initCountries();
  }

  showCancelConfirm = false;
  redirectUrl = '';

  cancelConfirm(): void {
    this.showCancelConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/patient');
  }

  get onQueriesLoded(): Observable<any> { return this._onQueriesLoded; }
  private _onQueriesLoded = new Subject();

  get onHierarchyProjects(): Observable<any> { return this._onHierarchyProjects; }
  private _onHierarchyProjects = new Subject();

  private _filters = [
    [false, false, false, false, false, false, false],
    [false, false, false],
  ];

  getFilterCount(i: number): string {
    if (!this._filters || !this._filters[i]) { return 'None'; }
    const c = this._filters[i].filter(x => x).length;
    return c ? `${c}` : 'None';
  }

  getRegexCount(): string {
    if (!this.regexes || !this.regexes.length) { return 'None'; }
    return this.regexes.length ? `${this.regexes.length}` : 'None';
  }

  getCategoriesCount(): string {
    if (!this.hierarchyProjects || !this.hierarchyProjects.length) { return 'None'; }
    const c = this.hierarchyProjects.filter(x => x.selectedId).length;
    return c ? `${c}` : 'None';
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

  isValueChanged = false;

  hipaa_date_shift = 0;
  general_numeric_shift = 0;
  general_date_shift = 0;

  regexes = [];

  removeRegex(r: any): void {
    this.regexes = this.regexes.filter(x => x !== r);
    this.isValueChanged = true;
  }

  addRegex(): void {
    this.regexes.push({
      name: '',
      value: ''
    });
    this.isValueChanged = true;
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

  private _isNeedValidate = true;
  validate(): boolean {
    this.resetValidation();
    if (!this._isNeedValidate) { return true; }
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
  private editQueryId = 0;

  selectQuery(): void {
    if (!this._queries || !this._queries.length) { return; }
    if (!this.editQueryId) { return; }
    const q = this._queries.find(x => x.session_id == this.editQueryId);
    if (q) {
      this.settings.queryId = q.session_id;
      this.queryName = q.session_name;
    }
  }

  get hierarchyProjects(): Array<any> { return this._hierarchyProjects; }
  private _hierarchyProjects: Array<any>;
  get isHierarchyProjectsaded(): boolean { return this._isHierarchyProjectsaded; }
  private _isHierarchyProjectsaded = false;

  setHierarchyProjects(): void {
    this._isHierarchyProjectsaded = false;
    this._prevHierarchyProjectID = this.settings.projectId;
    this.http.get(`${this.getHierarchyProjectUrl}/${this.settings.projectId}`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this._isHierarchyProjectsaded = true;
        this._hierarchyProjects = res.data;
        this.selectHierarchies();
        this._onHierarchyProjects.next();
      }, error => {
        this._isHierarchyProjectsaded = true;
      })
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
        this.selectQuery();
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
  private getHierarchyProjectUrl = `${environment.serverUrl}${environment.endPoints.patientStoryHierarchy}`;

  setTab(tab: number): void {
    if (!this.validate()) { return; }
    this._selectedTab = tab;
    this.refreshEvents();
  }

  setNextTab(i: number): void {
    if (!this.validate()) { return; }
    this._selectedTab += i;
    this.refreshEvents();
  }

  get events(): Array<any> { return this._events; }
  private _events: Array<any>;
  private _prevEventProjectID = 0;
  private _prevHierarchyProjectID = 0;

  refreshEvents(): void {
    if (this._selectedTab === 1) {
      if (this.settings.projectId !== this._prevEventProjectID) {
        this.loadEvents();
      }
    }
    if (this._selectedTab === 2) {
      if (this.settings.projectId !== this._prevHierarchyProjectID) {
        this.setHierarchyProjects();
      }
    }
    if (this._selectedTab !== 3) { return; }
    this._events = JSON.parse(JSON.stringify(this.events));
  }

  get isEventsLoaded(): boolean { return this._isEventsLoaded; }
  private _isEventsLoaded = true;

  loadEvents(): void {
    this._isEventsLoaded = false;
    this._events = undefined;
    this._prevEventProjectID = this.settings.projectId;
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
        this.selectEvents();
        this._isEventsLoaded = true;
      }, error => {
        this._isEventsLoaded = true;
      })
  }

  selectedEvents: any;
  selectEvents(): void {
    if (!this.selectedEvents) { return; }
    if (!this.events) { return; }
    this.events.forEach((event: any) => {
      if (!this.selectedEvents[event.eventId] || !this.selectedEvents[event.eventId].length) { return; }
      this.selectedEvents[event.eventId].forEach(id => {
        const selected = event.siteEventPropertyInfos.find(x => x.eventPropertyName && x.eventPropertyName.toLowerCase() === id.toLowerCase());
        if (selected) {
          selected.isChecked = true;
          event.isChecked = true;
          event.isExpanded = true;
        }
      });
    })
  }

  hierarchies: any;
  selectHierarchies(): void {
    const dict = this.hierarchies || {};
    if (!this._hierarchyProjects) { return; }
    //alert(JSON.stringify(dict))
    //alert(JSON.stringify(this._hierarchyProjects))
    this._hierarchyProjects.forEach(p => {
      if (!dict[p.hierarchyRootId]) {
        const selected = p.hierarchyLevels.find(x => x.sortValue === 0);
        if (selected) {
          p.selectedId = selected.hierarchyLevelId;
        }
        return;
      }
      p.selectedId = dict[p.hierarchyRootId];
    })
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
  _isCopy = false;

  reset(params: any): void {
    this.isValueChanged = false;
    this.showCancelConfirm = false;
    this.resetValidation();
    this.selectedEvents = undefined;
    this.hierarchies = undefined;
    this.regexes = [];
    this._storyId = params.id;
    this._isCopy = !!params.copy
    this._selectedTab = 0;
    this.editQueryId = 0;
    this.queryName = '';
    this.projectName = '';
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
    const copy = this._isCopy ? 'Copy of ' : '';
    this._settings.settingsName = `${copy}${settings.name}`;
    this._settings.projectId = parseInt(`${settings.projectId}`);
    if (this._settings.projectId) {
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
      if (settings.transJson.hipaa_inclusion.split) {
        settings.transJson.hipaa_inclusion.split(',').forEach(str => {
          if (dict[str.toLowerCase().trim()]) {
            this[dict[str.toLowerCase().trim()]] = true;
          }
        });
      } else {
        settings.transJson.hipaa_inclusion.forEach(str => {
          if (dict[str.toLowerCase().trim()]) {
            this[dict[str.toLowerCase().trim()]] = true;
          }
        });
      }
    }

    this.general_date_shift = parseInt(`${settings.transJson.general_date_shift || '0'}`);
    this.general_numeric_shift = parseInt(`${settings.transJson.general_numeric_shift || '0'}`);
    this.isMaxDateShiftingChecked = !!this.general_date_shift;
    this.isMaxNumericStringChecked = !!this.general_numeric_shift;
    const phone = `${settings.transJson.hipaa_phone || ''}`;
    if (phone) {
      this.selectedCountry = this.countries.findIndex(x => x.value === phone);
    }
    if (settings.transJson.custom_regexes) {
      Object.keys(settings.transJson.custom_regexes).forEach((k, i) => {
        this.regexes.push({ name: k, value: settings.transJson.custom_regexes[k], id: i })
      })
    }

    this.isFreeTextChecked = settings.transJson.free_text;
    this.selectedEvents = settings.transJson.event_inclusion;
    this.hierarchies = settings.transJson.hierarchies;
    this.editQueryId = settings.transJson.input_population || 0;

    this.loadEvents();
    this.setHierarchyProjects();
    this.setQueries();
    //this.selectEvents();
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

  save(): void {
    if (!this.validate()) { return; }
    //const obj = this.convertToServer();
    //document.write(JSON.stringify(obj));
    //console.log(obj);
    this._dataLoaded = false;
    const method = this._storyId && !this._isCopy ? 'put' : 'post';
    const id = this._storyId && !this._isCopy ? this._storyId : '';

    if (this.settings.cohortSource === 1) {
      const obj = this.convertToServer();
      console.log(obj);
      this.http[method](
        `${environment.serverUrl}${environment.endPoints.patientStory}/${id}`, obj
      )
        .pipe(take(1))
        .subscribe(res => {
          this._dataLoaded = true;
          this.notificationService.addNotification({
            type: ToasterType.success,
            name: 'Patient story saved successfully.',
            comment: 'The user can now query the allowed data.',
            showInToaster: true
          });
          this.router.navigateByUrl('/patient');
        }, error => {
          this._dataLoaded = true;
          this.notificationService.addNotification({
            type: ToasterType.error,
            name: 'Failed to save patient story.',
            comment: 'Try again or contact MDClone support.',
            showInToaster: true
          });
        })
    } else {
      const fd = this.createForm();
      this.uploadService.addWithKey({
        notification: {
          name: `Uploading ${this.file.name}`,
          failName: `Failed to upload ${this.file.name}.`,
          failComment: 'Try again or contact MDClone support.',
          succName: 'Patient story file uploaded successfully.',
          abortName: 'Aborted successfully.',
          abortComment: `Upload of ${this.file.name} was successfully aborted.`,
          comment: this.configService.getValue('MI00003'),
          succComment: `Upload of ${this.file.name} was successful.`,
          progress: 0,
          status: NotificationStatus.uploading,
          showProgress: true,
          showInContainer: true,
          startDate: new Date(),
          progressTitle: `${this.file.name}`,
          type: ToasterType.infoProgressBar,
          showInToaster: true,
          containerEnable: true,
          removeOnComplete: true,
          onComplete: () => {
            this._dataLoaded = true;
          }
        },
        form: fd,
        url: `${environment.serverUrl}${environment.endPoints.patientStory}/${id}`
      });
    }
  }

  createForm(): FormData {
    const obj = this.convertToServer();
    const formData: FormData = new FormData();
    formData.append('file', this.file);
    formData.append('json', JSON.stringify(obj));
    return formData;
  }

  convertToServer(): any {
    const res = {
      lifeFluxTransId: this._storyId,
      name: this.settings.settingsName,
      projectId: this.settings.projectId,
      //userId:0,
      outputType: this.settings.outputFormat == 0 ? 'files' : 'impala',
      transJson: {
        input_mode: this.settings.cohortSource === 1 ? 'session' : 'file',
        input_population: this.settings.queryId,
        event_inclusion: this.geteventInclusion(),
        hierarchies: this.getHierarchies(),
        general_date_shift: this.general_date_shift,
        general_numeric_shift: this.general_numeric_shift,
        hipaa_inclusion: this.gethipaaInclusion(),
        hipaa_date_shift: this.hipaa_date_shift,
        hipaa_phone: this.selectedCountry >= 0 ? this.countries[this.selectedCountry].value : '',
        custom_regexes: this.getCustomRegexes()
      }
    };
    return res;
  }

  private geteventInclusion(): any {
    const res = {};
    this.events.filter(e => e.isChecked)
      .forEach(e => {
        res[e.eventId] = [];
        e.siteEventPropertyInfos.filter((se: any) => se.isChecked)
          .forEach((se: any) => {
            res[e.eventId].push(se.eventPropertyName);
          });
      })
    return res;
  }

  private getHierarchies(): any {
    const res = {};
    this._hierarchyProjects.filter(p => p.selectedId)
      .forEach(p => {
        res[p.hierarchyRootId] = p.selectedId;
      });
    return res;
  }

  private gethipaaInclusion(): Array<string> {
    const res = [];
    if (this.isPhoneItemChecked) { res.push('phone'); }
    if (this.isZipCodeChecked) { res.push('zip'); }
    if (this.isOldPatientsChecked) { res.push('older_than_89'); }
    if (this.isExtraYearsChecked) { res.push('date_shift'); }
    if (this.isEmailChecked) { res.push('email'); }
    if (this.isIpChecked) { res.push('ip'); }
    if (this.isUrlChecked) { res.push('url'); }
    return res;
  }

  private getCustomRegexes(): any {
    const res = {};
    this.regexes.forEach((r: any) => {
      res[r.name] = r.value
    })
    return res;
  }
}
