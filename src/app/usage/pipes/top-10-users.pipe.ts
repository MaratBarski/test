import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';
import { DateService } from '@appcore';

@Pipe({ name: 'userTop10Chart' })
export class Top10ChartPipe implements PipeTransform {
    constructor(private usageRequestService: UsageRequestService) { }
    transform(data: any, ...args: any[]): any {
        const res = {
            query: [],
            download: []
        }
        if (!data) { return res; }
        data = this.usageRequestService.createData(data);
        if (!data) { return res; }

        if (data.newQuery) {
            res.query = this.usageRequestService.distinctDate(data.newQuery, 'userName', 'count');
            // res.query = data.newQuery.map(x => {
            //     return {
            //         name: x.userName,
            //         value: x.count
            //     }
            // });
        }
        if (data.downloads) {
            res.download = this.usageRequestService.distinctSeries(data.downloads, 'userName');
            // res.download = data.downloads.map(x => {
            //     return {
            //         name: x.userName,
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