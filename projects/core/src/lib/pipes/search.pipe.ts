import { Pipe, PipeTransform } from '@angular/core';
import { SearchService, SearchModel } from '../services/search.service';
import { TableRowModel } from '../components/table/table.component';

@Pipe({
  name: 'mdcSearch'
})
export class SearchPipe implements PipeTransform {
  constructor(
    private searchService: SearchService
  ) {
  }

  transform(rows: Array<TableRowModel>, searchModel: SearchModel): any {
    return this.searchService.filterRows(rows, searchModel);
  }

}
