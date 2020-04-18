import { Pipe, PipeTransform } from '@angular/core';
import { MenuLink } from '../components/modal-menu/modal-menu.component';
import { TableRowModel } from '../components/table/table.component';

@Pipe({
  name: 'actionLink'
})
export class ActionLinkPipe implements PipeTransform {

  transform(links: Array<MenuLink>, row: TableRowModel): any {
    if (!row || !row.source) { return links; }
    return links.filter(link => {
      if (!link.hidden) { return true; }
      if (link.hidden === true) { return false; }
      return !link.hidden(row.source);
    }).map(link => {
      if (link.disable && link.disable !== false && link.disable !== true) {
        link.disable = link.disable(row.source);
      }
      return link;
    });
  }

}
