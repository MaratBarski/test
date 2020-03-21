import { Pipe, PipeTransform } from '@angular/core';
import { ComponentService } from '../services/component.service';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {
  constructor(private componentService: ComponentService) { }
  transform(value: string, ...args: any[]): any {
    return this.componentService.getFileName(value);
  }
}
