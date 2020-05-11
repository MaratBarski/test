import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { TableModel, ColumnType, DataService, DateService } from '@app/core-api';
import { formatDate } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { UsageReportParams } from '../models/usage-request';
import { UsageRequestService } from './usage-request.service';


@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private usageRequestService: UsageRequestService,
    @Inject(LOCALE_ID) private locale: string
  ) {
  }

  createDataSource(files: Array<any>): TableModel {
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
          columnId: 'daysSinceLastLogin',
          text: 'Days Since Last Login',
          isSortEnabled: true,
          csvTitle: 'Days Since Last Login'
        },
        {
          columnId: 'lastlogin',
          text: 'Last Login',
          isSortEnabled: true,
          csvTitle: 'Last Login',
          columnType: ColumnType.Date
        },
        {
          columnId: 'environment',
          text: 'Environment',
          isSortEnabled: true,
          csvTitle: 'Environment'
        }
      ],
      rows: []
    }
    if (files) {
      files.forEach((fl, i) => {
        data.rows.push({
          cells: {
            login: fl.login,
            daysSinceLastLogin: this.dateService.getDaysDiff(fl.lastlogin, now),
            lastlogin: fl.lastlogin, //formatDate(fl.lastlogin, 'dd/MM/yyyy', this.locale),
            environment: 'environment'
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
