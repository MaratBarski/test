import { Injectable } from '@angular/core';
import { DataService, LoginService, TableModel } from '@appcore';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientStoryService {

  constructor(
    private dataService: DataService,
    private loginService: LoginService
  ) { }


  @Offline('assets/offline/patientStory.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.patientStory}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(files: Array<any>): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit',
            icon: 'ic-edit',
            command: 'edit'
            , checkDisabled: (source: any) => {
              return (!source.transStatus
                || source.transStatus.toLowerCase() === 'pending'
                || source.transStatus.toLowerCase() === 'generating'
              );
            }
          },
          {
            text: 'Dublicate',
            icon: 'ic-view',
            command: 'dublicate'
            , checkDisabled: (source: any) => {
              return (!source.transStatus
                || source.transStatus.toLowerCase() === 'pending'
                || source.transStatus.toLowerCase() === 'generating'
              );
            }
          },
          {
            text: 'Download XML',
            icon: 'ic-view',
            command: 'download'
            , checkDisabled: (source: any) => {
              return !source.outputType || source.outputType.toLowerCase() !== 'files';
            }
          }
        ],
        subLinks: [
          {
            text: 'Abort',
            disable: false,
            icon: 'ic-delete',
            command: 'abort'
            , checkDisabled: (source: any) => {
              if (!source.projectObj) { return true; }
              if (this.loginService.isAdminOfProject(source.projectObj.projectId)) { return false; }
              if (source.fileType) { return true; }
              if (source.uploadedBy === this.loginService.userInfo.data.id) { return false; }
              return true;
            }
          },
          {
            text: 'Delete',
            disable: false,
            icon: 'ic-delete',
            command: 'delete'
            , checkDisabled: (source: any) => {
              if (!source.projectObj) { return true; }
              if (this.loginService.isAdminOfProject(source.projectObj.projectId)) { return false; }
              if (source.fileType) { return true; }
              if (source.uploadedBy === this.loginService.userInfo.data.id) { return false; }
              return true;
            }
          }
        ]
      },
      headers: [
        {
          columnId: 'SettingsName',
          text: 'Settings Name',
          isSortEnabled: true,
          csvTitle: 'File Name',
          showDetails: false,
          css: 'w-md-300 w-xxl-200',
          cellCss: 'admin-table__item',
          innerCss: 'admin-table__name'
        },
        {
          columnId: 'Modified',
          text: 'Modified',
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },
        {
          columnId: 'User',
          text: 'User',
          isSortEnabled: true,
          csvTitle: 'User',
          css: 'd-none d-md-table-cell w-md-100 w-xxl-150',
          cellCss: 'd-none d-md-table-cell admin-table__text-cut'
        },
        {
          columnId: 'Status',
          text: 'Status',
          isSortEnabled: true,
          css: 'd-none d-lg-table-cell admin-table__item_center_xxl w-xxl-100',
          cellCss: 'd-none d-lg-table-cell admin-table__item_center_xxl'
        },
        {
          columnId: 'OutputFormat',
          text: 'Output Format',
          isSortEnabled: true,
          css: 'd-none d-lg-table-cell w-md-150 w-xxl-200',
          cellCss: 'd-none d-lg-table-cell admin-table__text-cut'
        }
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      fl.transStatus = fl.transStatus ? fl.transStatus.toLowerCase() : '';
      data.rows.push({
        cells: {
          SettingsName: fl.name,
          Modified: fl.updateDate,
          User: fl.user ? fl.user.login : '',
          Status: fl.transStatus,
          OutputFormat: fl.outputType === 'files' ? 'XML Files' : 'Table'
        },
        source: fl,
        isActive: false,
        isInactive: false
      })
    })
    return data;
  }
}
