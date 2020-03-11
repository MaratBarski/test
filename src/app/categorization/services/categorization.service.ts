import { Injectable } from '@angular/core';
import { DataService, ENV, TableModel } from 'appcore';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';

@Injectable({
  providedIn: 'root'
})
export class CategorizationService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${ENV.serverUrl}${ENV.endPoints.fileSource}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(files: Array<any>): TableModel {
    const data: TableModel = {
      headers: [{
        columnId: 'No',
        text: 'No',
        isSortEnabled: true,
        sortDir: 'desc',
        isSortedColumn: true
      },
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
        isSortEnabled: true
      },
      {
        columnId: 'environment',
        text: 'Permission Group',
        isSortEnabled: true
      },
      {
        columnId: 'user',
        text: 'User',
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
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          fileName: fl.fileName,
          insertDate: fl.insertDate,
          environment: fl.projectObj ? fl.projectObj.projectName : '',
          user: fl.uploadedBy
        },
        isActive: false
      })
    })
    data.rows.forEach((r, i) => {
      r.cells['No'] = i;
    });
    return data;
  }

  
}
