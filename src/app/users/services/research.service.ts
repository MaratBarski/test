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
          css: 'admin-table__item admin-table__perm-40 w-xxl-20 w-xxxl-25',
          cellCss: 'admin-table__item',
          cellContainerCss: 'admin-table__name'
        },
        {
          columnId: 'PermissionsetDescription',
          text: 'Permission set Description',
          csvTitle: 'Permission set Description',
          hidden: true
        },
        {
          columnId: 'User',
          text: 'User',
          filter: true,
          isSortEnabled: true,
          sortDir: 'desc',
          isSortedColumn: true,
          csvTitle: 'User full name',
          css: 'admin-table__item d-none d-md-table-cell admin-table__perm-20 w-xxl-20 w-xxxl-25',
          cellCss: 'admin-table__item d-none d-md-table-cell',
          cellContainerCss: 'admin-table__name'
        },
        {
          columnId: 'Modified',
          text: 'Modified',
          isSortEnabled: true,
          filter: false,
          //csvTitle: 'Modified',
          css: 'admin-table__item d-none d-md-table-cell admin-table__modif',
          cellCss: 'admin-table__item d-none d-md-table-cell',
          cellContainerCss: 'admin-table__name'
        },
        {
          columnId: 'Environment',
          text: 'Environment',
          isSortEnabled: true,
          filter: true,
          csvTitle: 'Environment',
          css: 'admin-table__item d-none d-lg-table-cell admin-table__perm-20',
          cellCss: 'admin-table__item d-none d-lg-table-cell',
          cellContainerCss: 'admin-table__text-cut'
        },
        {
          columnId: 'ApprovalKey',
          text: 'Approval Key',
          isSortEnabled: true,
          csvTitle: 'Approval Key',
          css: 'admin-table__item d-none d-xxl-table-cell'
        },
        {
          columnId: 'approvalKeyExpirationDate',
          text: 'Key Expiration date',
          hidden: true,
          csvTitle: 'Key Expiration date'
        },
        {
          columnId: 'KeyStatus',
          text: 'Key Status',
          csvTitle: 'Key Status',
          css: 'admin-table__item d-none d-xxl-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'Active',
          text: 'Active',
          csvTitle: 'Active',
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'maxPatients',
          text: 'Allowed cohort size',
          csvTitle: 'Allowed cohort size',
          hidden: true
        },
        {
          columnId: 'startDate',
          text: 'Allowed date range',
          csvTitle: 'From',
          hidden: true
        },
        {
          columnId: 'endDate',
          text: 'Allowed date range',
          csvTitle: 'To',
          hidden: true
        },
        {
          columnId: 'PermissionTemplate',
          text: 'Permission template',
          csvTitle: 'Permission template',
          hidden: true
        },
        {
          columnId: 'Allowedcontent',
          text: 'Allowed content',
          csvTitle: 'Allowed content',
          hidden: true
        },
      ],
      rows: []
    }
    files.forEach((fl, i) => {
      data.rows.push({
        cells: {
          PermissionSetName: fl.researchName,
          PermissionsetDescription: fl.researchDescription || 'Description',
          User: fl.user ? fl.user.firstName + ' ' + fl.user.firstName : '',
          Modified: fl.insertDate,
          Environment: fl.project ? fl.project.projectName : '',
          ApprovalKey: fl.approvalKey,
          KeyStatus: fl.researchStatus,
          Active: fl.endDate,
          maxPatients: fl.maxPatients,
          startDate: fl.startDate,
          endDate: fl.endDate,
          PermissionTemplate: fl.researchTemplates ? fl.researchTemplates.map((t: any) =>
            //t.templateName
            t.templateId
          ).join(';') : '',
          Allowedcontent: fl.researchRestrictionEvents ? fl.researchRestrictionEvents.map((e: any) =>
            `[${e.eventName} ${e.eventPropertyId} ${e.value}]`
          ).join(';') : ';',
          approvalKeyExpirationDate: fl.approvalKeyExpirationDate || ''
        },
        source: fl,
        isActive: true,
        csv: {
          Active: fl.endDate && fl.endDate.trim() !== '' ? new Date(fl.endDate) > new Date() ? 'yes' : 'no' : 'yes'
        }
      })
    })
    return data;
  }


}

