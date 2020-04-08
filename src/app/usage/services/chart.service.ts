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

  @Offline('assets/offline/usageReport.json?')
  private getGeneralUsageUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  //http://10.0.2.18:4000/mdclone/api/v1/reporting/usage/25-06-2000/25-09-2021

  getGeneralUsage(info: InfoPanel): Observable<Array<any>> {
    return this.dataService.get(this.getGeneralUsageUrl);
  }
}
