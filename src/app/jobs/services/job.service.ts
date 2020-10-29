import { Injectable } from '@angular/core';
import { DataService, LoginService, TableModel } from '@appcore';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private dataService: DataService,
    private loginService: LoginService
  ) { }


  @Offline('assets/offline/jobs.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.job}`;

  private abortUrl = `${environment.serverUrl}${environment.endPoints.patientStoryAbort}`;

  abort(item: any): Observable<any> {
    return this.dataService.get(`${this.abortUrl}/${item.source.lifeFluxTransId}`);
  }

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  deletePatientStory(item: any): Observable<any> {
    return this.dataService.delete(`${environment.serverUrl}${environment.endPoints.patientStory}/${item.lifeFluxTransId}`);
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
              return !(source.transStatus.toLowerCase() === 'failed' || source.transStatus.toLowerCase() === 'success' || source.transStatus.toLowerCase() === 'aborted');
            }
          },
          {
            text: 'Dublicate',
            icon: 'ic-view',
            command: 'dublicate'
            , checkDisabled: (source: any) => {
              return !(source.transStatus.toLowerCase() === 'failed' || source.transStatus.toLowerCase() === 'success' || source.transStatus.toLowerCase() === 'aborted');
            }
          },
          {
            text: 'Download XML',
            icon: 'ic-view',
            command: 'download'
            , checkDisabled: (source: any) => {
              return source.transStatus.toLowerCase() !== 'success' || source.outputType.toLowerCase() === 'impala';
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
              return !(source.transStatus.toLowerCase() === 'pending' || source.transStatus.toLowerCase() === 'running');
            }
          },
          {
            text: 'Delete',
            disable: false,
            icon: 'ic-delete',
            command: 'delete'
            , checkDisabled: (source: any) => {
              return !(source.transStatus.toLowerCase() === 'failed' || source.transStatus.toLowerCase() === 'success' || source.transStatus.toLowerCase() === 'aborted');
            }
          }
        ]
      },
      headers: [
        {
          columnId: 'jobName',
          text: 'Name',
          isSortEnabled: true,
          csvTitle: 'Name',
          showDetails: false,
          css: 'w-md-300 w-xxl-200',
          cellCss: 'admin-table__item',
          innerCss: 'admin-table__name'
        },
        {
          columnId: 'jobCreated',
          text: 'Created',
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },
        {
          columnId: 'jobLastRun',
          text: 'Last Run',
          isSortEnabled: true,
          sortDir: 'desc',
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },
        {
          columnId: 'jslDuration',
          text: 'Duration',
          isSortEnabled: true,
          sortDir: 'desc',
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },
        {
          columnId: 'jslStatus',
          text: 'Status',
          isSortEnabled: true,
          sortDir: 'desc',
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },  
         {
          columnId: 'jobNextRun',
          text: 'Next Run',
          isSortEnabled: true,
          sortDir: 'desc',
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },    
         {
          columnId: 'jobEnabled',
          text: 'Active',
          isSortEnabled: true,
          sortDir: 'desc',
          css: 'd-none d-md-table-cell w-md-150 w-xxl-100',
          cellCss: 'd-none d-md-table-cell'
        },                     
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      fl.transStatus = fl.transStatus ? fl.transStatus.toLowerCase() : '';
      data.rows.push({
        cells: {
          jobName: fl.jobName,
          jobCreated: fl.jobCreated,
          jobLastRun: fl.jobLastRun,
          jslDuration: fl.jslDuration ? fl.jslDuration.milliseconds : '',
          jslStatus: fl.jslStatus,
          jobNextRun: fl.jobNextRun,    
          jobEnabled: fl.jobEnabled,                    
        },
        source: fl,
        isActive: false,
        isInactive: false
      })
    })
    return data;
  }
}

