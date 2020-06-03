import { Injectable } from '@angular/core';
import { DataService, TableModel, CheckBoxListOption } from '@appcore';
import { Observable } from 'rxjs';
import { FileSourceResponse, FileSource } from '../models/file-source';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { FileSourceStatus } from '../models/enum/FileSourceStatus';

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;

  load(): Observable<FileSourceResponse> {
    return this.dataService.get(this.getUrl);
  }

  deleteFile(fl: FileSource): Observable<any> {
    return this.dataService.delete(`${environment.serverUrl}${environment.endPoints.deleteFileSource}/${fl.fileId}`);
  }

  getFilter(filterArray: Array<CheckBoxListOption>): Array<CheckBoxListOption> {
    const dict = {};
    const res = [];
    filterArray.forEach((value, index) => {
      if (dict[value.id]) {
        return;
      }
      dict[value.id] = value.id;
      res.push({ ...value, isChecked: true });
    })
    return res;
  }

  createDataSource(files: Array<FileSource>): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit File Settings',
            icon: 'ic-edit',
            command: 'edit'
            , checkDisabled: (source: any) => {
              if (!source.fileStatus) { return false; }
              return source.fileStatus === FileSourceStatus.MAPPED;
            }
          },
          {
            text: 'View output summary',
            icon: 'ic-view',
            command: 'view'
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
          columnId: 'fileName',
          text: 'Name',
          isSortEnabled: true,
          csvTitle: 'File Name',
          showDetails: false,
          css: 'w-xxl-8 w-md-6'
        },
        {
          columnId: 'insertDate',
          text: 'Loaded',
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          css: 'd-none d-md-table-cell'
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment',
          css: 'd-none d-md-table-cell w-md-3'
        },
        {
          columnId: 'permission',
          text: 'Permission Group',
          isSortEnabled: true,
          filter: true,
          css: 'd-none d-lg-table-cell w-md-3'
        },
        {
          columnId: 'user',
          text: 'User',
          isSortEnabled: false,
          filter: true,
          css: 'd-none d-xxl-table-cell'
        },
        {
          columnId: 'shared',
          text: 'Shared',
          isSortEnabled: false,
          css: 'd-none d-md-table-cell admin-table__item_center'
        },
        {
          columnId: 'columns',
          text: 'Columns',
          isSortEnabled: true,
          css: 'd-none d-xxl-table-cell admin-table__item_right'
        },
        {
          columnId: 'rows',
          text: 'Rows',
          isSortEnabled: true,
          css: 'd-none d-xxl-table-cell admin-table__item_right'
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
          permission: fl.template ? fl.template.templateName : '',
          user: fl.user && fl.user.firstName && fl.user.lastName ? `${fl.user.firstName} ${fl.user.lastName}` : fl.user && fl.user.login ? fl.user.login : '',
          shared: fl.fileType,
          columns: fl.columnsNum,
          rows: fl.rowsNum
        },
        csv: {
          fileName: fl.fileName
        },
        source: fl,
        isActive: false
      })
    })
    return data;
  }


}
