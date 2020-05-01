import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, separator: string, replacement: string): string {
    if (!value) { return ''; }
    return value.replace(new RegExp(separator, 'g'), replacement);
  }

}
