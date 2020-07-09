import { Injectable } from '@angular/core';
import { DataService, TableModel, CheckBoxListOption, LoginService } from '@appcore';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  constructor(
    private dataService: DataService,
    private loginService: LoginService
  ) { }

  @Offline('assets/offline/research.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.research}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  deleteFile(fl: any): Observable<any> {
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

  createDataSource(files: Array<any>): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit',
            icon: 'ic-edit',
            command: 'edit'
            , checkDisabled: (source: any) => {
              return false;
            }
          }
        ],
        subLinks: [
          {
            text: 'Delete',
            icon: 'ic-delete',
            command: 'delete'
            , checkDisabled: (source: any) => {
              return false;
            }
          }
        ]
      },
      headers: [
        {
          columnId: 'PermissionSetName',
          text: 'Permission Set Name',
          isSortEnabled: true,
          csvTitle: 'Permission Set Name',
          showDetails: false,
          css: 'admin-table__item admin-table__perm-40 w-xxl-20 w-xxxl-25'
        },
        {
          columnId: 'User',
          text: 'User',
          filter: true,
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          csvTitle: 'User',
          css: 'admin-table__item d-none d-md-table-cell admin-table__perm-20 w-xxl-20 w-xxxl-25'
        },
        {
          columnId: 'Modified',
          text: 'Modified',
          isSortEnabled: true,
          filter: false,
          csvTitle: 'Modified',
          css: 'admin-table__item d-none d-md-table-cell admin-table__modif'
        },
        {
          columnId: 'Environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment',
          css: 'admin-table__item d-none d-lg-table-cell admin-table__perm-20'
        },
        {
          columnId: 'ApprovalKey',
          text: 'Approval Key',
          isSortEnabled: true,
          csvTitle: 'Approval Key',
          css: 'admin-table__item d-none d-xxl-table-cell'
        },
        {
          columnId: 'KeyStatus',
          text: 'Key Status',
          css: 'admin-table__item d-none d-xxl-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'Active',
          text: 'Active',
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center admin-table__status'
        }
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          PermissionSetName: fl.researchName,
          User: fl.userId,
          Modified: fl.insertDate,
          Environment: fl.projectId,
          ApprovalKey: fl.approvalKey,
          KeyStatus: fl.researchStatus,
          Active: fl.endDate
        },
        source: fl,
        isActive: true
      })
    })
    return data;
  }


}

