import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';
import { DateService } from '@appcore';

@Pipe({ name: 'monthlyChart' })
export class MonthlyChartPipe implements PipeTransform {
    constructor(
        private dateService: DateService,
        private usageRequestService: UsageRequestService
    ) { }
    transform(data: any, ...args: any[]): any {
        const res = {
            query: [],
            download: []
        }
        if (!data) { return res; }
        data = this.usageRequestService.createData(data);
        if (!data) { return res; }

        if (data.newQuery) {
            res.query = this.dateService.sortByMonthYear(this.usageRequestService.distinctDate(data.newQuery, 'date', 'count'), 'name');
            // res.query = data.newQuery.map(x => {
            //     return {
            //         name: x.date,
            //         value: x.count
            //     }
            // });
        }
        if (data.downloads) {
            res.download = this.dateService.sortByMonthYear(this.usageRequestService.distinctSeries(data.downloads), 'name');
            // res.download = data.downloads.map(x => {
            //     return {
            //         name: x.date,
            //         series: [
            //             { name: 'syntetic', value: x.syntetic },
            //             { name: 'origin', value: x.origin }
            //         ]
            //     };
            // });
        }
        return res;
    }
}