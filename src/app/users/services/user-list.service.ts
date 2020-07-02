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

  getUserRoles(user: any): Array<string> {
    const projects = user.projects || [];
    const authorities = user.authorities || [];
    const roles = projects.filter((p: any) => p.UserType).map((p: any) => p.UserType.userType ? p.UserType.userType.toLowerCase() : '');
    const dict = {};
    if (authorities.find(x => {
      if (!x.name) { return false; }
      return (x.name.trim().trim().toUpperCase() === 'ROLE_SUPERADMIN');
    })) {
      dict['superadmin'] = true;
    }
    const res = [];
    if (dict['superadmin']) { res.push('superadmin'); }
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
    if (!projects) { return res; }
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
            , checkHidden: (source) => {
              return false;
            }
            , checkDisabled: (source) => {
              return false;
            },
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
          css: ''
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
          css: 'd-none d-lg-table-cell'
        },
        {
          columnId: 'modified',
          text: 'Modified',
          isSortEnabled: true,
          isSortedColumn: true,
          sortDir: 'desc',
          css: 'd-none d-xl-table-cell admin-table__date'
        },
        {
          columnId: 'active',
          text: 'Status',
          isSortEnabled: false,
          css: 'd-none d-md-table-cell admin-table__item_center admin-table__status'
        },
        {
          columnId: 'specialRoles',
          text: 'Admin Roles',
          isSortEnabled: true,
          css: 'd-none d-xl-table-cell'
        }
      ],
      rows: []
    }
    users.forEach((u, i) => {
      const roles = this.getUserRoles(u);
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

