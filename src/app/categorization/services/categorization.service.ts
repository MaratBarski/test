import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { CategoryeResponse } from '../models/category-reponse';
import { Hierarchy } from '@app/imported-files/models/hierarchy';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CategorizationService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/hierarchy.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}`;

  load(): Observable<CategoryeResponse> {
    return this.dataService.get(this.getUrl);
  }

  updateHierarchyChange(hierarchy: any, state: boolean): void {
    // call dataService to update hierarchy state
  }

  createDataSource(categories: Array<Hierarchy>): TableModel {
    const data: TableModel = {
      headers: [
        {
          columnId: 'hierarchyName',
          text: 'Name',
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true
        },
        {
          columnId: 'hierarchyFile',
          text: 'File Name',
          isSortEnabled: true
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
          hierarchyFile: fl.hierarchyFile,
          insertDate: fl.insertDate,
          domain: fl.domain,
          defaultLevelId: fl.defaultLevelId
        },
        isActive: false,
        source: fl
      })
    })
    return data;
  }


}

