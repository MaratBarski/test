import {Injectable} from '@angular/core';
import {DataService, ENV, TableModel} from 'appcore';
import {Observable} from 'rxjs';
import {FileSourceResponse, FileSource, FileSourceMappingResponse} from '../models/file-source';
import {Offline} from 'src/app/shared/decorators/offline.decorator';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesMappingService implements Resolve<FileSourceMappingResponse> {

  constructor(private dataService: DataService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FileSourceMappingResponse> | Promise<FileSourceMappingResponse> | FileSourceMappingResponse {
    debugger;
    let id = route.paramMap.get('id');
    this.getUrl = `${ENV.serverUrl}${ENV.endPoints.fileSource}/${id}`;
    return this.load();
  }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${ENV.serverUrl}${ENV.endPoints.fileSource}`;

  load(): Observable<FileSourceMappingResponse> {
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
        },
        {
          columnId: 'editColumn',
          text: '',
          isSortEnabled: false
        }
      ],
      rows: []
    };
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          fileName: fl.fileName,
          insertDate: fl.insertDate,
          environment: fl.projectObj ? fl.projectObj.projectName : '',
          user: fl.uploadedBy
        },
        isActive: false
      });
    });
    data.rows.forEach((r, i) => {
      r.cells['No'] = i;
    });
    return data;
  }
}
