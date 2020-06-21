import { Pipe, PipeTransform } from '@angular/core';
import { FormatNumberService } from '../services/format-number.service';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  constructor(private formatService: FormatNumberService) { }
  transform(value: number, ...args: any[]): any {
    return this.formatService.formatNumber(value);
  }

}
