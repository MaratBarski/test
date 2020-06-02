import { Pipe, PipeTransform } from '@angular/core';
import { TableModel } from '@appcore';

@Pipe({
  name: 'retention'
})
export class RetentionPipe implements PipeTransform {

  transform(model: TableModel, filter: { days: number }): any {
    if (!model || !model.rows) { return model; }
    return {
      ...model, ...{
        rows:
          model.rows.filter(r => {
            return r.source.days >= filter.days;
          })
      }
    }
  }

}
