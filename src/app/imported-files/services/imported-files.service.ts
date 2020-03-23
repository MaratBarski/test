import { Injectable } from '@angular/core';
import { DataService, TableModel } from 'appcore';
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
  

  createDataSource(files: Array<FileSource>): TableModel {
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
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          fileName: fl.fileName,
          insertDate: fl.insertDate,
          environment: fl.projectObj ? fl.projectObj.projectName : '',
          permission: fl.template ? fl.template.templateName : '',
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
