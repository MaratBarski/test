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

  deleteCategory(hierarchy: any): Observable<any> {
    //alert(`${environment.serverUrl}${environment.endPoints.deleteCategory}/${hierarchy.hierarchyRootId}`);
    return this.dataService.delete(`${environment.serverUrl}${environment.endPoints.deleteCategory}/${hierarchy.hierarchyRootId}`);
  }

  createDataSource(categories: Array<Hierarchy>): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit',
            icon: 'ic-edit',
            command: 'edit'
          },
          {
            text: 'Download',
            icon: 'ic-download',
            command: 'download'
          }
        ],
        subLinks: [
          {
            text: 'Delete',
            disable: false,
            icon: 'ic-delete',
            command: 'delete'
          }
        ]
      },
      headers: [
        {
          columnId: 'hierarchyName',
          text: 'Name',
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          showDetails: true,
          css: 'w-xxl-8 w-md-6'
        },
        {
          columnId: 'hierarchyFile',
          text: 'File Name',
          isSortEnabled: true,
          css: 'w-xxl-8 w-md-6'
        },
        {
          columnId: 'insertDate',
          text: 'Modified',
          isSortEnabled: true,
          css: 'd-none d-md-table-cell w-md-3'
        },
        {
          columnId: 'state',
          text: 'State',
          isSortEnabled: false,
          css: 'd-none d-md-table-cell admin-table__item_center'
        },
        {
          columnId: 'domain',
          text: 'Environment 	',
          isSortEnabled: true,
          filter: true,
          css: 'd-none d-xxl-table-cell admin-table__item_left'
        },
        {
          columnId: 'inUseColumn',
          text: 'In Use',
          isSortEnabled: false,
          css: 'd-none d-md-table-cell admin-table__item_center'
        }
      ],
      rows: []
    }
    categories.forEach((fl, i) => {
      data.rows.push({
        cells: {
          hierarchyName: fl.hierarchyName,
          hierarchyFile: fl.hierarchyFile,
          insertDate: fl.insertDate,
          domain: fl.project && fl.project.projectName ? fl.project.projectName : '',
          defaultLevelId: fl.defaultLevelId
        },
        isActive: false,
        source: fl
      })
    })
    return data;
  }
}

