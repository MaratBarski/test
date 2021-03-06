import { Injectable } from '@angular/core';
import { DataService, TableModel } from '@app/core-api';
import { Observable, Subject } from 'rxjs';
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

  get onUploadComplete(): Observable<void> { return this._onUploadComplete }
  private _onUploadComplete: Subject<void> = new Subject();

  uploadComplete(): void {
    this._onUploadComplete.next();
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
            icon: 'ic-delete',
            command: 'delete'
            , checkDisabled: (source: any) => {
              return source.hierarchyLoadingType === 'etl';
            }
          }
        ]
      },
      headers: [
        {
          columnId: 'hierarchyName',
          text: 'Name',
          isSortEnabled: true,
          sortDir: 'desc',
          showDetails: true,
          css: 'w-xxl-300 w-md-150'
        },
        {
          columnId: 'hierarchyFile',
          text: 'File Name',
          isSortEnabled: true,
          css: 'w-xxl-300 w-md-150 d-none d-md-table-cell'
        },
        {
          columnId: 'insertDate',
          text: 'Modified',
          isSortEnabled: true,
          isSortedColumn: true,
          sortDir: 'desc',
          css: 'd-none d-lg-table-cell'
        },
        {
          columnId: 'state',
          text: 'State',
          isSortEnabled: true,
          css: 'd-none d-xl-table-cell admin-table__item_center admin-table__state'
        },
        {
          columnId: 'domain',
          text: 'Environment 	',
          isSortEnabled: true,
          filter: true,
          css: 'd-none d-xxxl-table-cell admin-table__item_left'
        },
        {
          columnId: 'inUseColumn',
          text: 'In Use',
          isSortEnabled: false,
          css: 'd-none d-xl-table-cell admin-table__item_center admin-table__use'
        }
      ],
      rows: []
    }
    categories.forEach((fl, i) => {
      data.rows.push({
        cells: {
          hierarchyName: fl.hierarchyName,
          hierarchyFile: fl.hierarchyFile,
          insertDate: fl.modifiedDate,
          domain: fl.project && fl.project.projectName ? fl.project.projectName : '',
          defaultLevelId: fl.defaultLevelId,
          state: `${fl.status || ''}${fl.hierarchyLoadingType || ''}${fl.hierarchyChange || ''}`
        },
        actionsDisabled: fl.status === 'unmapped',
        isActive: false,
        isInactive: fl.status === 'deleting',
        source: fl
      })
    })
    return data;
  }
}

