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


@Pipe({
  name: 'generalChart'
})
export class GeneralChartPipe implements PipeTransform {
  transform(arr: Array<any>, ...args: any[]): any {
    if (!arr) { return []; }
    return arr.map(x => {
      return {
        name: x.date,
        value: x.count
      };
    })
  }
}

@Pipe({
  name: 'monthlyChart'
})
export class MonthlyChartPipe implements PipeTransform {
  transform(data: any, ...args: any[]): any {
    const res = {
      query: [],
      download: []
    }
    if (!data) { return res; }
    if (data.newQuery) {
      res.query = data.newQuery.map(x => {
        return {
          name: x.date,
          value: x.count
        }
      })
    }
    if (data.downloads) {
      res.download = data.downloads.map(x => {
        return {
          name: x.date,
          series: [
            { name: 'syntetic', value: x.syntetic },
            { name: 'origin', value: x.origin }
          ]
        };
      });
    }
    return res;
  }
}

@Pipe({
  name: 'userActivityChart'
})
export class UserActivityChartPipe implements PipeTransform {
  transform(data: any, ...args: any[]): any {
    const res = {
      query: [],
      download: []
    }
    if (!data) { return res; }
    if (data.query) {
      res.query = data.query;
    }
    if (data.download) {
      res.download = data.download;
    }
    return res;
  }
}

@Pipe({
  name: 'userTop10Chart'
})
export class Top10ChartPipe implements PipeTransform {
  transform(data: any, ...args: any[]): any {
    const res = {
      query: [],
      download: []
    }
    if (!data) { return res; }
    if (data.newQuery) {
      res.query = data.newQuery.map(x => {
        return {
          name: x.date,
          value: x.count
        }
      })
    }
    if (data.downloads) {
      res.download = data.downloads.map(x => {
        return {
          name: x.date,
          series: [
            { name: 'syntetic', value: x.syntetic },
            { name: 'origin', value: x.origin }
          ]
        };
      });
    }
    return res;
  }
}




