import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { TableModel, ColumnType, DataService, DateService } from '@app/core-api';
import { formatDate } from '@angular/common';
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

export const GetDefaultState = (): UsageReportState => {
  return {
    tab: 0,
    subTab: -1,
    activity: 0,
    yearId: 0,
    includeAdmin: false,
    environment: ''
  }
}
export interface UsageReportState {
  tab: number;
  subTab: number;
  activity: number;
  yearId: number;
  includeAdmin: boolean;
  environment: string;
}
export interface UsageReportParams {
  fromDate?: Date | string;
  toDate?: Date | string;
}

export const UsageLinks = [
  {
    url: 'general-usage',
    text: 'General Usage',
    css: 'd-none d-md-inline-block',
    alt: 'd-md-none'
  },
  {
    url: 'monthly-activity',
    text: 'Monthly Activity',
    css: 'd-none d-md-inline-block',
    alt: 'd-md-none'
  },
  {
    url: 'activity-per-user',
    text: 'Activity per User',
    css: 'd-none d-lg-inline-block',
    alt: 'd-lg-none'
  },
  {
    url: 'top-10-users',
    text: 'Top 10 Users',
    css: 'd-none d-lg-inline-block', 
    alt: 'd-lg-none'
  },
  {
    url: 'retention',
    text: 'Retention',
    hidden: true
  },
  {
    url: 'created',
    text: 'Created'
  },
  {
    url: 'table',
    text: 'Table'
  }
];
@Injectable({
  providedIn: 'root'
})
export class UsageService {

  get onStateChanged(): Observable<UsageReportState> {
    return this._onStateChanged.asObservable();
  }

  private _onStateChanged = new BehaviorSubject<UsageReportState>(GetDefaultState());

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    @Inject(LOCALE_ID) private locale: string
  ) {
  }

  getEnvironments(): Observable<Array<string>> {
    return this.dataService.get('opa')
      .pipe(
        catchError((e) => {
          return of(['dfasdfadfas']);
        }),
        tap(() => {
        }),
        switchMap(() => {
          return of(
            ['1', '2', '3']
          );
        })
      )
  }

  setState(state: UsageReportState): void {
    this._onStateChanged.next(state);
  }

  @Offline('assets/offline/usageReport.json?')
  private getUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  //http://10.0.2.18:4000/mdclone/api/v1/reporting/usage/25-06-2000/25-09-2021

  getUsageReport(params: UsageReportParams): any {
    params.fromDate = new Date(params.fromDate || new Date());
    params.toDate = new Date(params.toDate || new Date());
    const url = `${this.getUrl}/${this.dateService.formatDate(params.fromDate)}/${this.dateService.formatDate(params.toDate)}`;
    //alert(url);
    return this.dataService.get(url);
  }

  createDataSource(files: Array<any>): TableModel {
    const now = new Date();
    const data: TableModel = {
      headers: [
        {
          columnId: 'login',
          text: 'User Name',
          isSortEnabled: true,
          csvTitle: 'User Name'
        },
        {
          columnId: 'daysSinceLastLogin',
          text: 'Days Since Last Login',
          isSortEnabled: true,
          csvTitle: 'Days Since Last Login'
        },
        {
          columnId: 'lastlogin',
          text: 'Last Login',
          isSortEnabled: true,
          csvTitle: 'Last Login',
          columnType: ColumnType.Date
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          csvTitle: 'Environment'
        }
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          login: fl.login,
          daysSinceLastLogin: this.dateService.getDaysDiff(fl.lastlogin, now),
          lastlogin: fl.lastlogin, //formatDate(fl.lastlogin, 'dd/MM/yyyy', this.locale),
          environment: 'environment'
        },
        csv: {
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }

}
