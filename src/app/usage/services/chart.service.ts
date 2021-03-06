import { Injectable } from '@angular/core';
import { DataService, DateService } from '@appcore';
import { Observable, of } from 'rxjs';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { finalize, catchError, delay, tap } from 'rxjs/operators';
import { UsageRequestService } from './usage-request.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private dataService: DataService,
    private usageRequestService: UsageRequestService,
    private dateService: DateService
  ) { }

  get isLoaded(): boolean {
    return !this.isLoading;
  }
  get isLoading(): boolean {
    return this._isLoding;
  }
  private _isLoding = false;

  get dateRangeString(): string {
    //return `${this.usageRequestService.usageRequest.fromDate}/${this.usageRequestService.usageRequest.toDate}`;
    return `${this.usageRequestService.usageRequest.fromDate}/${this.dateService.addDay(this.usageRequestService.usageRequest.toDate, -1)}`;
  }

  get includeAdminString(): string {
    return `withAdminUsers=${this.usageRequestService.usageRequest.includeAdmin}`;
  }

  get environmentString(): string {
    if (!this.usageRequestService.usageRequest.environment ||
      this.usageRequestService.usageRequest.environment === '' ||
      this.usageRequestService.usageRequest.environment === '0'
    ) { return ''; }
    return `${this.usageRequestService.usageRequest.environment}`;
  }

  get requestString(): string {
    return `${this.dateRangeString}/${this.environmentString}/?${this.includeAdminString}`;
  }

  getChart(url: string): Observable<any> {
    this._isLoding = true;
    return this.dataService.get(url).pipe(
      delay(200),
      finalize(() => {
        this._isLoding = false;
      }),
      catchError(e => {
        this._isLoding = false;
        return of(e);
      })
    );
  }

  getCsv(): void {
    //alert(`${environment.serverUrl}${environment.endPoints.usageCsvDownload}/${this.dateRangeString}`);
    window.open(`${environment.serverUrl}${environment.endPoints.usageCsvDownload}/${this.dateRangeString}?adminUsers=${this.usageRequestService.usageRequest.includeAdmin}&env=${this.environmentString}`);
  }

  @Offline('assets/offline/usageGeneral.json?')
  private getGeneralUsageUrl = `${environment.serverUrl}${environment.endPoints.usageActiveUsage}`;
  getGeneralUsage(info: any = undefined): Observable<any> {
    //alert(`${this.getGeneralUsageUrl}/${this.requestString}`)
    return this.getChart(`${this.getGeneralUsageUrl}/${this.requestString}`);
  }

  @Offline('assets/offline/usageMonthly.json?')
  private getMonthlyUsageUrl = `${environment.serverUrl}${environment.endPoints.usageMonthlyUsage}`;
  getMonthlyUsage(info: any = undefined): Observable<any> {
    //alert(`${this.getMonthlyUsageUrl}/${this.requestString}`);
    return this.getChart(`${this.getMonthlyUsageUrl}/${this.requestString}`);
  }

  @Offline('assets/offline/usageUserActivity.json?')
  private getUserActivityUsageUrl = `${environment.serverUrl}${environment.endPoints.usagePerUser}`;
  getActivityUserUsage(callBack: any): Observable<any> {
    //alert((`${this.getUserActivityUsageUrl}/${this.requestString}`));
    return this.getChart(`${this.getUserActivityUsageUrl}/${this.requestString}`).pipe(
      tap(res => {
        this.usageRequestService.initUsers(res);
        callBack(res);
      })
    );
  }

  @Offline('assets/offline/usageTop10.json?')
  private getTop10UsageUrl = `${environment.serverUrl}${environment.endPoints.usageTop10Users}`;
  getTop10Usage(info: any = undefined): Observable<any> {
    //alert(`${this.getTop10UsageUrl}/${this.requestString}`);
    return this.getChart(`${this.getTop10UsageUrl}/${this.requestString}`);
  }

  @Offline('assets/offline/usageCreated.json?')
  private getCreatedUsageeUrl = `${environment.serverUrl}${environment.endPoints.usageCreatedUsers}`;
  getCreatedUsagee(info: any = undefined): Observable<any> {
    //alert(`${this.getCreatedUsageeUrl}/${this.requestString}`);
    return this.getChart(`${this.getCreatedUsageeUrl}/${this.requestString}`);
  }

  @Offline('assets/offline/usageRetention.json?')
  private getUsageRetentionUrl = `${environment.serverUrl}${environment.endPoints.usageRetantionTable}`;
  getUsageRetention(info: any = undefined): Observable<any> {
    //alert(`${this.getUsageRetentionUrl}${this.environmentString}/?${this.includeAdminString}`);
    return this.getChart(`${this.getUsageRetentionUrl}/${this.environmentString}/?${this.includeAdminString}`);
  }

  @Offline('assets/offline/usageSummaryTable.json?')
  private getSummaryTableUrl = `${environment.serverUrl}${environment.endPoints.usageSummaryTable}`;
  getSummaryTable(info: any = undefined): Observable<any> {
    //alert(`${this.getSummaryTableUrl}/${this.requestString}`);
    return this.getChart(`${this.getSummaryTableUrl}/${this.requestString}`).pipe(
      tap(res => {
        this.usageRequestService.initSummaryUsers(res);
      })
    );
  }
}