import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';

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