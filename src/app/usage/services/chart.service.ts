import { Injectable } from '@angular/core';
import { DataService } from '@app/core-api';
import { Observable, of } from 'rxjs';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { InfoPanel } from '../components/usage-dashboard-info-panel/usage-dashboard-info-panel.component';
import { finalize, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private dataService: DataService
  ) { }

  get isLoaded(): boolean {
    return !this.isLoading;
  }
  get isLoading(): boolean {
    return this._isLoding;
  }
  private _isLoding = false;

  getChart(url: string): Observable<any> {
    this._isLoding = true;
    return this.dataService.get(url).pipe(
      finalize(() => {
        setTimeout(() => {
          this._isLoding = false;
        }, 0);
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
  getGeneralUsage(info: InfoPanel): Observable<any> {
    return this.getChart(this.getGeneralUsageUrl);
  }

  @Offline('assets/offline/usageMonthly.json?')
  private getMonthlyUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getMonthlyUsage(info: InfoPanel): Observable<any> {
    return this.getChart(this.getMonthlyUsageUrl);
  }

  @Offline('assets/offline/usageUserActivity.json?')
  private getUserActivityUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getActivityUserUsage(info: InfoPanel): Observable<any> {
    return this.getChart(this.getUserActivityUsageUrl);
  }

  @Offline('assets/offline/usageTop10.json?')
  private getTop10UsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getTop10Usage(info: InfoPanel): Observable<any> {
    return this.getChart(this.getTop10UsageUrl);
  }

  @Offline('assets/offline/usageCreated.json?')
  private getCreatedUsageeUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getCreatedUsagee(info: InfoPanel): Observable<any> {
    return this.getChart(this.getCreatedUsageeUrl);
  }
}
