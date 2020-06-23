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
          csvTitle: 'User Name'
        },
        {
          columnId: 'lastlogin',
          text: 'Last Login',
          isSortEnabled: true,
          csvTitle: 'Last Login',
          isSortedColumn: true,
          sortDir: 'desc',
          columnType: ColumnType.Date
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
          csvTitle: 'Login Days'
        },
        {
          columnId: 'origin',
          text: 'Original',
          isSortEnabled: true,
          csvTitle: 'Original',
          columnType: ColumnType.Number
        },
        {
          columnId: 'syntetic',
          text: 'Synthetic',
          isSortEnabled: true,
          csvTitle: 'Synthetic',
          columnType: ColumnType.Number
        }
      ],
      rows: []
    }

    if (!files) { return data }

    files.forEach((fl, i) => {
      if (!this.usageRequestService.isUserInList(fl.userId)) {
        return;
      }
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
          css: 'admin-table__item d-none d-md-table-cell admin-table__item_center'
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
    if (files) {
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
