import { Injectable } from '@angular/core';
import { DataService, ENV, TableModel } from 'appcore';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';

@Injectable({
  providedIn: 'root'
})
export class CategorizationService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/hierarchy.json')
  private getUrl = `${ENV.serverUrl}${ENV.endPoints.hierarchy}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(files: Array<any>): TableModel {
    const data: TableModel = {
      headers: [{
        columnId: 'hierarchyName',
        text: 'Name',
        isSortEnabled: true,
        sortDir: 'desc',
        isSortedColumn: true
      },
      {
        columnId: 'insertDate',
        text: 'Modified',
        isSortEnabled: true
      },
      {
        columnId: 'state',
        text: 'State',
        isSortEnabled: true
      },
      {
        columnId: 'domain',
        text: 'Environment 	',
        isSortEnabled: true
      },
      {
        columnId: 'inUseColumn',
        text: 'In Use',
        isSortEnabled: true
      },
      {
        columnId: 'editColumn',
        text: '',
        isSortEnabled: false
      },
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          hierarchyName: fl.hierarchyName,
          insertDate: fl.insertDate,
          //state: fl.projectId,
          domain: fl.domain,
          defaultLevelId: fl.defaultLevelId
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

