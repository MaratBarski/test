import { Injectable } from '@angular/core';
import { DataService } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { InfoPanel } from '../components/usage-dashboard-info-panel/usage-dashboard-info-panel.component';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private dataService: DataService
  ) { }

  //http://10.0.2.18:4000/mdclone/api/v1/reporting/usage/25-06-2000/25-09-2021
  @Offline('assets/offline/usageGeneral.json?')
  private getGeneralUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getGeneralUsage(info: InfoPanel): Observable<Array<any>> {
    return this.dataService.get(this.getGeneralUsageUrl);
  }

  @Offline('assets/offline/usageMonthly.json?')
  private getMonthlyUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getMonthlyUsage(info: InfoPanel): Observable<Array<any>> {
    return this.dataService.get(this.getMonthlyUsageUrl);
  }

  @Offline('assets/offline/usageUserActivity.json?')
  private getUserActivityUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getActivityUserUsage(info: InfoPanel): Observable<Array<any>> {
    return this.dataService.get(this.getUserActivityUsageUrl);
  }

  @Offline('assets/offline/usageTop10.json?')
  private getTop10UsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  getTop10Usage(info: InfoPanel): Observable<Array<any>> {
    return this.dataService.get(this.getTop10UsageUrl);
  }
}
