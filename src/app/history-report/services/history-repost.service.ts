import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryReportService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/history.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(history: Array<any>): TableModel {
    const data: TableModel = {
      headers: [
        {
          columnId: 'insertDate',
          text: 'Date',
          isSortEnabled: true
        },
      ],
      rows: []
    }
    history.forEach((fl, i) => {
      data.rows.push({
        cells: {
          insertDate: fl.insertDate,
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
