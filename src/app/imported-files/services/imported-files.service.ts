import { Injectable } from '@angular/core';
import { DataService, TableModel, CheckBoxListOption } from 'appcore';
import { Observable } from 'rxjs';
import { FileSourceResponse, FileSource } from '../models/file-source';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

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
            command: 'edit',
            disable: true
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
          showDetails: false
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
          filter: true,
          csvTitle: 'Environment'
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
        }
        //, {
        //   columnId: 'editColumn',
        //   text: '',
        //   isSortEnabled: false
        // }
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
          user: fl.uploadedBy,
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
