import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from '@appcore';

@Pipe({
  name: 'hierarchyOptions'
})
export class HierarchyOptionsPipe implements PipeTransform {

  transform(hierarchy: any, ...args: any[]): Array<SelectOption> {
    return [{
      text: 'Select Category Level...',
      id: 0
    }].concat(
      hierarchy.hierarchyLevels.map(level => {
        return {
          text: level.hierarchyLevelName,
          id: level.hierarchyLevelId
        }
      }));
  }

}
