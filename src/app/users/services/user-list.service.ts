import { Injectable } from '@angular/core';
import { DataService, TableModel, CheckBoxListOption } from '@appcore';
import { Observable } from 'rxjs';
import { Offline } from 'src/app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  createDataSource(users: Array<any>): TableModel {
    const data: TableModel = {
      // actions: {
      //   links: [
      //     {
      //       text: 'Edit File Settings',
      //       icon: 'ic-edit',
      //       command: 'edit'
      //       ,hidden: (source) => {
      //         if (!source.projectObj) { return false; }
      //         return source.projectObj.projectName === 'ETL project';
      //       },
      //       disable: false
      //     },
      //     {
      //       text: 'View output summary',
      //       icon: 'ic-view',
      //       command: 'view'
      //     }
      //   ],
      //   subLinks: [
      //     {
      //       text: 'Delete',
      //       disable: false,
      //       icon: 'ic-delete',
      //       command: 'delete'
      //     }
      //   ]
      // },
      headers: [
        {
          columnId: 'fullName',
          text: 'Full Name',
          isSortEnabled: true,
          showDetails: true,
          css: 'w-xxl-8 w-md-6'
        },
        {
          columnId: 'userName',
          text: 'Username',
          isSortEnabled: true,
          css: 'd-none d-md-table-cell'
        },
        {
          columnId: 'email',
          text: 'Email',
          isSortEnabled: true,
          css: 'd-none d-md-table-cell w-md-3'
        },
        {
          columnId: 'modified',
          text: 'Modified',
          isSortEnabled: true,
          isSortedColumn: true,
          sortDir: 'desc',
          css: 'd-none d-lg-table-cell w-md-3'
        },
        {
          columnId: 'active',
          text: 'Active',
          isSortEnabled: false,
          css: 'd-none d-md-table-cell admin-table__item_center'
        },
        {
          columnId: 'specialRoles',
          text: 'SpecialRoles',
          isSortEnabled: true,
          filter: true,
          css: 'd-none d-xxl-table-cell admin-table__item_right'
        }
      ],
      rows: []
    }
    users.forEach((u, i) => {
      data.rows.push({
        cells: {
          fullName: u.test,
          userName: u.test,
          email: u.test,
          modified: u.test,
          active: u.test,
          specialRoles: u.test
        },
        source: u,
      })
    })
    return data;
  }


}

