import { Injectable } from '@angular/core';
import { TableModel, ColumnType, DateService } from '@appcore';
import { UsageRequestService } from './usage-request.service';

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(
    private dateService: DateService,
    private usageRequestService: UsageRequestService
  ) {
  }

  createSummaryDataSource(files: Array<any>): TableModel {
    const now = new Date();
    files = this.usageRequestService.createData(files);
    const data: TableModel = {
      headers: [
        {
          columnId: 'login',
          text: 'User Name',
          isSortEnabled: true,
          csvTitle: 'User Name',
          css: 'admin-table__item'
        },
        {
          columnId: 'lastlogin',
          text: 'Last Login',
          isSortEnabled: true,
          csvTitle: 'Last Login',
          isSortedColumn: true,
          sortDir: 'desc',
          columnType: ColumnType.Date,
          css: 'admin-table__item d-none d-lg-table-cell'
        },
        {
          columnId: 'permission',
          text: 'Permission',
          isSortEnabled: true,
          csvTitle: 'Permission'
        },
        {
          columnId: 'loginDays',
          text: 'Login Days',
          isSortEnabled: true,
          csvTitle: 'Login Days',
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center'
        },
        {
          columnId: 'origin',
          text: 'Original Downloads',
          isSortEnabled: true,
          csvTitle: 'Original',
          columnType: ColumnType.Number,
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center'
        },
        {
          columnId: 'syntetic',
          text: 'Synthetic Downloads',
          isSortEnabled: true,
          csvTitle: 'Synthetic',
          columnType: ColumnType.Number,
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_right'
        }
      ],
      rows: []
    }

    if (!files || !files.length) { return data }

    files.forEach((fl, i) => {
      // if (!this.usageRequestService.isUserInList(fl.userId)) {
      //   return;
      // }
      data.rows.push({
        cells: {
          login: fl.userName,
          daysSinceLastLogin: this.dateService.getDaysDiff(fl.lastLogin, now),
          lastlogin: fl.lastLogin,
          permission: fl.permission,
          loginDays: fl.loginDays,
          origin: fl.origin,
          syntetic: fl.syntetic
        },
        csv: {
        },
        source: fl,
        isActive: false
      })
    })

    return data;
  }

  createRetentionDataSource(files: Array<any>): TableModel {
    if (!files) { files = []; }
    const dict = {};
    files = this.usageRequestService.createData(files);
    if (!files || !files.length) { files = []; }
    files.forEach(fl => {
      if (!dict[fl.userName]) {
        dict[fl.userName] = fl;
        dict[fl.userName].environmentCount = 1;
      } else {
        dict[fl.userName].environmentCount++;
      }
    })
    files = [];
    Object.keys(dict).forEach(k => {
      const obj = dict[k];
      if (obj.environmentCount > 1) {
        obj.environmentName = `${obj.environmentCount} environments`;
      }
      files.push(obj);
    })
    const now = new Date();
    const data: TableModel = {
      headers: [
        {
          columnId: 'login',
          text: 'User Name',
          isSortEnabled: true,
          csvTitle: 'User Name',
          css: 'admin-table__item'
        },
        {
          columnId: 'lastlogin',
          text: 'Last Activity',
          isSortEnabled: true,
          csvTitle: 'Last Activity',
          css: 'admin-table__item d-none d-lg-table-cell'
        },
        {
          columnId: 'daysSinceLastLogin',
          text: 'Days Since Last Activity',
          isSortEnabled: true,
          sortDir: 'asc',
          isSortedColumn: true,
          csvTitle: 'Days Since Last Activity',
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_right',
          cellCss: 'admin-table__item d-none d-md-table-cell admin-table__item_right'
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          csvTitle: 'Environment',
          css: '"admin-table__item d-none d-md-table-cell'
        }
      ],
      rows: []
    }
    if (files && files.length) {
      files.forEach((fl, i) => {
        data.rows.push({
          cells: {
            login: fl.userName,
            lastlogin: fl.lastActivity,
            daysSinceLastLogin: fl.days,//this.dateService.getDaysDiff(fl.lastlogin, now),
            environment: fl.environmentName
          },
          csv: {
          },
          source: fl,
          isActive: false
        })
      })
    }
    return data;
  }
}
