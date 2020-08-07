import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userProject'
})
export class UserProjectPipe implements PipeTransform {

  transform(projects: Array<any>, user: any): Array<any> {
    if (!user) { return projects; }
    if (!user.projects || !user.projects.length) { return []; }
    
    const dict = {};
    user.projects.forEach(p => {
      dict[p.projectId.toString()] = true;
    });
    return projects.filter(p => {
      return dict[p.id.toString()];
    });
  }

}
