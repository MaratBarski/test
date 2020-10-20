import { Pipe, PipeTransform } from '@angular/core';
import { PermissionSetService } from '../services/permission-set.service';

@Pipe({
  name: 'distinctTemplate'
})
export class DistinctTemplatePipe implements PipeTransform {

  constructor(private service: PermissionSetService) { }

  private sort(arr: Array<any>): Array<any> {
    return arr.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
  }

  private getTemplates(args: any = undefined): Array<any> {
    if (!this.service.templates) { return []; }
    const selected = this.service.templates.filter(x => x.isChecked || (args && args.state === 2));
    const dict = {}
    selected.forEach(x => {
      x.templateItems.forEach(y => {
        dict[y.name.toLowerCase()] = y;
      });
    });
    const res = [];
    Object.keys(dict).forEach(k => {
      res.push({
        name: k
      })
    });
    return this.sort(res);
  }

  private getEvents(args: any = undefined): Array<any> {
    if (!this.service.events) { return []; }
    const res = [];
    const dict = {}
    this.service.events.forEach(item => {
      if (dict[item.eventTableAlias]) { return; }
      dict[item.eventTableAlias] = true;
      res.push({
        name: item.eventTableAlias
      });
    });
    return this.sort(res);
  }

  transform(templates: Array<any>, args: any = undefined): Array<any> {
    if (this.service.permissionSet.allowedEvent === 1) {
      return [];
    }
    if (this.service.permissionSet.allowedEvent === 3) {
      return this.getTemplates(args);
    }
    return this.getEvents(args);
  }
}
