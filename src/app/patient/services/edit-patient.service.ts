import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, NotificationsService } from '@appcore';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { ConfigService } from '@app/shared/services/config.service';
import { environment } from '@env/environment';
import { forkJoin, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { OutputFormats } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EditPatientService {

  get dataLoaded(): boolean { return this._dataLoaded; }
  private _dataLoaded = true;

  get selectedTab(): number { return this._selectedTab; }
  private _selectedTab = 0;

  get isShowError(): boolean { return this._isShowError; }
  private _isShowError = false;

  get settings(): any { return this._settings; }
  private _settings: any;

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
    return of(this.getDefault());
  }

  loadQueries(): Observable<any> {
    return this.http.get(this.queriesoUrl);
  }

  @Offline('assets/offline/selectedSettings.json?')
  private siteEventInfoUrl = `${environment.serverUrl}${environment.endPoints.siteEventInfo}`;


  @Offline('assets/offline/queries.json?')
  private queriesoUrl = `${environment.serverUrl}${environment.endPoints.siteEventInfo}`;


  setTab(tab: number): void {
    this._selectedTab = tab;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationsService,
    private navigationService: NavigationService
  ) { }

  reset(id: any = undefined): void {
    this.load();
  }

  load(): void {
    this._dataLoaded = false;
    forkJoin(
      this.loadSettings(),
      this.loadQueries()
    )
      .pipe(take(1))
      .subscribe(([settings, queries]: any) => {
        this._settings = settings.data;
        this._queries = queries.data;
        this._dataLoaded = true;
      }, error => {
        this._dataLoaded = true;
      });
  }
}
