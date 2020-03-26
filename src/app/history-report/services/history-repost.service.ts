import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { SessionHistoryResponse, SessionHistory } from '@app/models/session-history';

@Injectable({
  providedIn: 'root'
})
export class HistoryReportService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/history.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}/02-09-2018/02-10-2018`;

  load(): Observable<SessionHistoryResponse> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(history: Array<SessionHistory>): TableModel {
    const data: TableModel = {
      headers: [
        {
          columnId: 'insertDate',
          text: 'Date',
          isSortEnabled: true
        },
        {
          columnId: 'fullName',
          text: 'User',
          isSortEnabled: true
        },
        {
          columnId: 'source',
          text: 'Source',
          isSortEnabled: true
        },
        {
          columnId: 'approvalKey',
          text: 'Approval Key	',
          isSortEnabled: true
        },

      ],
      rows: []
    }
    history.forEach((fl, i) => {
      // let userQeSession = (fl.userQeSession);
      //debugger;
      //console.log(fl.userActivateSession != null ? fl.userActivateSession.approval_number : ""); 
      // console.log(userQeSession); 
      data.rows.push({
        cells: {
          insertDate: fl.insertDate,
          fullName: fl.userId,
          approvalKey: fl.userActivateSession != null ? fl.userActivateSession.approval_number : "",
          source: fl.sessionId != null ? "Query" : "Imported file",
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
