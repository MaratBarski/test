import { Injectable } from '@angular/core';
import { DataService } from '@app/core-api';
import { Observable, of } from 'rxjs';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { finalize, catchError, delay, tap, map } from 'rxjs/operators';
import { UsageRequestService } from './usage-request.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private dataService: DataService,
    private usageRequestService: UsageRequestService,
  ) { }

  get isLoaded(): boolean {
    return !this.isLoading;
  }
  get isLoading(): boolean {
    return this._isLoding;
  }
  private _isLoding = false;

  get dateRangeString(): string {
    return `${this.usageRequestService.usageRequest.fromDate}/${this.usageRequestService.usageRequest.toDate}`;
  }

  get includeAdminString(): string {
    return `${this.usageRequestService.usageRequest.includeAdmin}`;
  }

  get environmentString(): string {
    if (!this.usageRequestService.usageRequest.environment ||
      this.usageRequestService.usageRequest.environment === '' ||
      this.usageRequestService.usageRequest.environment === '0'
    ) { return ''; }
    return `/${this.usageRequestService.usageRequest.environment}`;
  }

  get requestString(): string {
    return `${this.dateRangeString}${this.environmentString}/?withAdminUsers=${this.includeAdminString}`;
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

  //http://10.0.2.18:4000/mdclone/api/v1/reporting/usage/25-06-2000/25-09-2021
  @Offline('assets/offline/usageGeneral.json?')
  private getGeneralUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getGeneralUsage(info: any = undefined): Observable<any> {
    //alert(this.requestString);
    alert(`${this.getGeneralUsageUrl}/${this.requestString}`)
    return this.getChart(`${this.getGeneralUsageUrl}/${this.requestString}`);
  }

  @Offline('assets/offline/usageMonthly.json?')
  private getMonthlyUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getMonthlyUsage(info: any = undefined): Observable<any> {
    //alert(this.dateRangeString);
    return this.getChart(this.getMonthlyUsageUrl);
  }

  @Offline('assets/offline/usageUserActivity.json?')
  private getUserActivityUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getActivityUserUsage(info: any = undefined): Observable<any> {
    alert((`${this.getUserActivityUsageUrl}/${this.requestString}`));
    return this.getChart(`${this.getUserActivityUsageUrl}/${this.requestString}`).pipe(
      tap(res => {
        this.usageRequestService.initUsers(res);
      })
    );
  }

  @Offline('assets/offline/usageTop10.json?')
  private getTop10UsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getTop10Usage(info: any = undefined): Observable<any> {
    //alert(this.dateRangeString);
    return this.getChart(this.getTop10UsageUrl);
  }

  @Offline('assets/offline/usageCreated.json?')
  private getCreatedUsageeUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getCreatedUsagee(info: any = undefined): Observable<any> {
    return this.getChart(this.getCreatedUsageeUrl);
  }
}
