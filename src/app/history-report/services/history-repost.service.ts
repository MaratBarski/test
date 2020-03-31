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
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}/01-01-2020`;

  load(): Observable<SessionHistoryResponse> {
    return this.dataService.get(this.getUrl);
  }

  downloadFile(fl: SessionHistory): Observable<any> {
    return this.http.get(`${environment.serverUrl}${environment.endPoints.downloadHistoryReport}/${fl.sessionHistoryId}`, { responseType: 'blob' });
    // return this.http.get(`${environment.serverUrl}${environment.endPoints.downloadHistoryReport}/${fl.sessionHistoryId}`, { responseType: 'blob'})



    // return this.dataService.get(`${environment.serverUrl}${environment.endPoints.downloadHistoryReport}/${fl.sessionHistoryId}`).toPromise()
    // .then(res => {
    //   const blob = new File();
    //   const fileName = 'CSV_CONTENT.ZIP';
    //   return window.URL.createObjectURL(blob)
    // }).catch(e => {
    //   console.error('Error delete file');
    // });

    // const blob = new Blob([data], { type: 'application/zip' });
    // const fileName = 'CSV_CONTENT.ZIP';
    // return this.http.get(`${environment.serverUrl}${environment.endPoints.downloadHistoryReport}/${fl.sessionHistoryId}`, this.createHeaders() );
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
          csvTitle: 'Date'
        },
        {
          columnId: 'fullName',
          text: 'User',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'User'
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
          name: i,
          insertDate: fl.insertDate,
          fullName: fl.userId,
          approvalKey: !!fl.userActivateSession ? fl.userActivateSession.approval_number : "",
          research: "Missing",
          data: "Missing",
          environment: fl.projectName,
          source: !!fl.sessionId ? "Query" : "Imported file",
          status: !!fl.transStatus,
          download: fl.sessionHistoryId,

          //$res[$i]['session_name'] = $session['session_id'] != null ? h($session['session_name']) : h($session['file_name_alias']);
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
