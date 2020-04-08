import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chartPipe'
})
export class ChartPipePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return [
      {
        "name": "China",
        "value": 2243772
      },
      {
        "name": "USA",
        "value": 1126000
      },
      {
        "name": "Norway",
        "value": 296215
      },
      {
        "name": "Japan",
        "value": 257363
      },
      {
        "name": "test test test",
        "value": 196750
      },
      {
        "name": "France",
        "value": 204617
      }
    ];
  }
}


