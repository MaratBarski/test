import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { SessionHistoryResponse, SessionHistory } from '@app/models/session-history';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HistoryReportUtils } from '../models/history-report-utils';

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
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}` + '/retrieveList';

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
          showDetails: true,
          css: 'admin-table__item d-none d-md-table-cell',
          // hidden: true
        },
        {
          columnId: 'fullName',
          text: 'User',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'User',
          css: 'admin-table__item d-none d-md-table-cell',
        },
        {
          columnId: 'name',
          text: 'Query/File Name',
          isSortEnabled: true,
          csvTitle: 'Query/File name /ID',
          css: 'admin-table__item'
        },
        {
          columnId: 'approvalKey',
          text: 'Approval Key',
          isSortEnabled: true,
          csvTitle: 'Approval Key',
          css: 'admin-table__item d-none d-xl-table-cell'
        },
        {
          columnId: 'research',
          text: 'Research',
          isSortEnabled: true,
          csvTitle: 'Research name',
          css: 'admin-table__item d-none d-xxxl-table-cell'
        },
        {
          columnId: 'data',
          text: 'Data',
          isSortEnabled: false,
          csvTitle: 'Data',
          css: 'admin-table__item d-none d-xxxl-table-cell'
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment',
          css: 'admin-table__item d-none d-xxxl-table-cell'
        },
        {
          columnId: 'source',
          text: 'Source',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Source',
          css: 'admin-table__item d-none d-xl-table-cell'
        },
        {
          columnId: 'status',
          text: 'Status',
          isSortEnabled: true,
          csvTitle: 'Status',
          css: 'admin-table__item d-none d-xl-table-cell admin-table__item_center'
        },
        {
          columnId: 'download',
          text: '',
          isSortEnabled: false,
          css: 'admin-table__item admin-table__load'
        },

      ],
      rows: []
    }

    history.forEach((fl, i) => {
      data.rows.push({
        cells: {
          name: i,
          insertDate: fl.insertDate,
          fullName: fl.fullName,
          data: fl.data,
          approvalKey: fl.approvalKey,
          research: fl.researchName,
          environment: fl.projectName,
          source: !!fl.sessionId ? "Query" : "Imported file",
          status: !!fl.transStatus ? "True" : "False",
          download: fl.sessionHistoryId,
          failureToolTip: this.getTransToolTip(fl.transMsg)
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
  getTransToolTip(transMsg: string): string {
    switch (transMsg) {
      case "Synthetic":
        return HistoryReportUtils.FailureSynthetic;
      case "Compare":
        return HistoryReportUtils.FailureComparison;
      default:
        return HistoryReportUtils.FailureDerivative
    }

  }


}
