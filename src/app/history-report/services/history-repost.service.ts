import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { SessionHistoryResponse, SessionHistory } from '@app/models/session-history';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryReportService {

  // private createHeaders = (): any => {
  //   return {
  //     headers: new HttpHeaders({
  //       'responseType': 'blob',
  //     })
  //   };
  // }

  constructor(private dataService: DataService, private http: HttpClient) { }

  @Offline('assets/offline/history.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}`;

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
          isSortedColumn: true,
          csvTitle: 'Date',
          showDetails: true
          // hidden: true
        },
        {
          columnId: 'fullName',
          text: 'User',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'User name'
        },
        {
          columnId: 'name',
          text: 'Query/File Name',
          isSortEnabled: true,
          csvTitle: 'Query/File name /ID'
        },
        {
          columnId: 'approvalKey',
          text: 'Approval Key',
          isSortEnabled: true,
          csvTitle: 'Approval Key'
        },
        {
          columnId: 'research',
          text: 'Research',
          isSortEnabled: true,
          csvTitle: 'Research name'
        },
        {
          columnId: 'data',
          text: 'Data',
          isSortEnabled: false,
          csvTitle: 'Data'
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment'
        },
        {
          columnId: 'source',
          text: 'Source',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Source'
        },
        {
          columnId: 'status',
          text: 'Status',
          isSortEnabled: true,
          csvTitle: 'Status'
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
      data.rows.push({
        cells: {
          name: i,
          insertDate: fl.insertDate,
          fullName: fl.user.firstName + " " + fl.user.lastName,
          approvalKey: !!fl.userActivateSession ? fl.userActivateSession.approval_number : "",
          research: "Missing",
          data: "Missing",
          environment: fl.projectName,
          source: !!fl.sessionId ? "Query" : "Imported file",
          status: !!fl.transStatus ? "True" : "False",
          download: fl.sessionHistoryId,
        },
        // csv: {
        //   status: !!fl.transStatus ? "True" : "False",
        // },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
