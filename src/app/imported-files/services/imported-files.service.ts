import { Injectable } from '@angular/core';
import { DataService, ENV, TableModel } from '../../core-api';
import { Observable } from 'rxjs';
import { FileSourceResponse, FileSource } from '../models/file-source';
import { Offline } from 'src/app/shared/decorators/offline.decorator';

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${ENV.serverUrl}${ENV.endPoints.fileSource}`;

  load(): Observable<FileSourceResponse> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(files: Array<FileSource>): TableModel {
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
