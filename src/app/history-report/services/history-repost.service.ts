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
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true
        },
        {
          columnId: 'fullName',
          text: 'User',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'name',
          text: 'Query/File Name',
          isSortEnabled: true
        },
        {
          columnId: 'approvalKey',
          text: 'Approval Key',
          isSortEnabled: true
        },
        {
          columnId: 'research',
          text: 'Research',
          isSortEnabled: true
        }, 
        {
          columnId: 'data',
          text: 'Data',
          isSortEnabled: true
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'source',
          text: 'Source',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'status',
          text: 'Status',
          isSortEnabled: true
        },
        {
          columnId: 'download',
          text: '',
          isSortEnabled: false
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
          approvalKey: !!fl.userActivateSession ? fl.userActivateSession.approval_number : "",
          research: "Missing",
          data: "Missing",
          environment: fl.projectName,
          source: !!fl.sessionId ? "Query" : "Imported file",
          status: !!fl.transStatus,
          //$res[$i]['session_name'] = $session['session_id'] != null ? h($session['session_name']) : h($session['file_name_alias']);
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
