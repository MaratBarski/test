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

  @Offline('assets/offline/historyReport.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.historyReport}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }


  createDataSource(history: Array<any>): TableModel {
    const data: TableModel = {
      headers: [
        {
          columnId: 'fileName',
          text: 'Name',
          isSortEnabled: true
        },
        {
          columnId: 'insertDate',
          text: 'Loaded',
          isSortEnabled: true
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'permission',
          text: 'Permission Group',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'user',
          text: 'User',
          isSortEnabled: true,
          filter: true
        },
        {
          columnId: 'shared',
          text: 'Shared',
          isSortEnabled: false
        },
        {
          columnId: 'columns',
          text: 'Columns',
          isSortEnabled: true
        },
        {
          columnId: 'rows',
          text: 'Rows',
          isSortEnabled: true
        },
        {
          columnId: 'editColumn',
          text: '',
          isSortEnabled: false
        }
      ],
      rows: []
    }
    history.forEach((fl, i) => {
      data.rows.push({
        cells: {
          fileName: fl.fileName,
          insertDate: fl.insertDate,
          environment: fl.projectObj ? fl.projectObj.projectName : '',
          permission: '???',  
          user: fl.uploadedBy,
          shared: fl.fileType,
          columns: 0,
          rows: 0
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
