import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinctTemplate'
})
export class DistinctTemplatePipe implements PipeTransform {

  transform(templates: Array<any>, args:any): Array<any> {
    if (!templates) { return []; }
    const selected = templates.filter(x => x.isChecked || (args && args.state === 2));
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
    return res.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
  }

}
