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

  get settings(): any { return this._settings; }
  private _settings: any;

  queryName = '';
  projectName = '';

  get queries(): Array<any> { return this._queries; }
  private _queries: Array<any>;

  getDefault(): any {
    return {
      data: {
        settingsName: 'settings name',
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

  @Offline('assets/offline/selectedSettings.json?')
  private siteEventInfoUrl = `${environment.serverUrl}${environment.endPoints.siteEventInfo}`;

  @Offline('assets/offline/userSession.json?')
  private queriesoUrl = `${environment.serverUrl}${environment.endPoints.patientStoryUserSession}`;

  @Offline('assets/offline/patientStory.json')
  private getStoriiesUrl = `${environment.serverUrl}${environment.endPoints.patientStory}`;

  setTab(tab: number): void {
    this._selectedTab = tab;
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
  }

  get storyId(): number { return this._storyId; }
  _storyId = 0;

  reset(id: number = undefined): void {
    this._storyId = id;
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
      const proj = this.loginService.findProject(this.settings.projectId);
      if (proj) {
        this.projectName = proj.projectName;
      }
    }
    this._settings.outputFormat = settings.outputType === 'files' ? 0 : 1;
    this._settings.cohortSource = settings.transJson.input_mode === 'session' ? 1 : 2;
    this._settings.queryId = 0;
  }
}
