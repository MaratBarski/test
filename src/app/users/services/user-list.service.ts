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

  @Offline('assets/offline/userList.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.userList}`;

  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }

  getUserRoles(projects: Array<any>): Array<string> {
    const roles = projects.filter((p: any) => p.UserType).map((p: any) => p.UserType.userType ? p.UserType.userType.toLowerCase() : '');
    const dict = {};
    const res = [];
    roles.forEach((x: any) => {
      if (!dict[x]) {
        dict[x] = true;
        res.push(x);
      }
    });
    return res;
  }

  getEnvironments(projects: Array<any>): any {
    const res = {};
    projects.forEach((p: any) => {
      res['' + p.projectId] = p;
    });
    return res;
  }

  createDataSource(users: Array<any>): TableModel {
    const data: TableModel = {
      actions: {
        links: [
          {
            text: 'Edit User',
            icon: 'ic-edit',
            command: 'edit'
            , hidden: (source) => {
              return false;
            },
            disable: false
          },
          {
            text: 'View User',
            icon: 'ic-view',
            command: 'view'
          }
        ],
        subLinks: [
          {
            text: 'Delete',
            disable: false,
            icon: 'ic-delete',
            command: 'delete'
          }
        ]
      },
      headers: [
        {
          columnId: 'fullName',
          text: 'Full Name',
          isSortEnabled: true,
          showDetails: true,
          css: 'w-md-3'
        },
        {
          columnId: 'userName',
          text: 'Username',
          isSortEnabled: true,
          css: 'd-none d-md-table-cell w-md-3'
        },
        {
          columnId: 'email',
          text: 'Email',
          isSortEnabled: true,
          css: 'd-none d-lg-table-cell w-md-3'
        },
        {
          columnId: 'modified',
          text: 'Modified',
          isSortEnabled: true,
          isSortedColumn: true,
          sortDir: 'desc',
          css: 'd-none d-xl-table-cell'
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
          css: 'd-none d-xl-table-cell w-md-3'
        }
      ],
      rows: []
    }
    users.forEach((u, i) => {
      const roles = this.getUserRoles(u.projects);
      const environments = this.getEnvironments(u.projects)
      data.rows.push({
        cells: {
          fullName: `${u.firstName} ${u.lastName}`,
          userName: u.login,
          email: u.email,
          modified: u.lastModifiedDate,
          active: u.activated,
          specialRoles: roles
        },
        source: { ...u, specialRoles: roles, environments: environments },
      })
    })
    return data;
  }


}

