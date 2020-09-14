import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userProject'
})
export class UserProjectPipe implements PipeTransform {

  transform(projects: Array<any>, user: any, userType: string = ''): Array<any> {
    if (!user) { return projects; }
    if (!user.projects || !user.projects.length) { return []; }
    const dict = {};
    user.projects.forEach(p => {
      dict[p.projectId.toString()] = true;
    });
    let res = projects.filter(p => {
      return dict[p.id.toString()];
    });
    if (!userType) { return res; }
    return res.filter(p => {
      return p.value && p.value.UserType && p.value.UserType.userType && p.value.UserType.userType.toLowerCase() === userType.toLowerCase();
    });
  }

}
