import { Injectable } from '@angular/core';
import { DataService, ENV, TableModel } from 'appcore';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { CategoryeResponse } from '../models/category-reponse';
import { Hierarchy } from '@app/imported-files/models/hierarchy';

@Injectable({
  providedIn: 'root'
})
export class CategorizationService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/hierarchy.json')
  private getUrl = `${ENV.serverUrl}${ENV.endPoints.hierarchy}`;

  load(): Observable<CategoryeResponse> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(categories: Array<Hierarchy>): TableModel {
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
    categories.forEach((fl, i) => {
      data.rows.push({
        cells: {
          hierarchyName: fl.hierarchyName,
          insertDate: fl.insertDate,
          domain: fl.domain,
          defaultLevelId: fl.defaultLevelId
        },
        isActive: false,
        source: fl
      })
    })
    data.rows.forEach((r, i) => {
      r.cells['No'] = i;
    });
    return data;
  }


}

