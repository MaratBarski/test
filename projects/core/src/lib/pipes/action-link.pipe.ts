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
      if (link.checkHidden) { return !link.checkHidden(row.source); }
      return !link.hidden;
    }).map(link => {
      if (link.checkDisabled) {
        link.disable = link.checkDisabled(row.source);
      }
      return link;
    });
  }

}
