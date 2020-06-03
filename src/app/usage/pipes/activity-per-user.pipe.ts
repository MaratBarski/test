import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';
import { DateService } from '@appcore';

@Pipe({ name: 'userActivityChart' })
export class UserActivityChartPipe implements PipeTransform {
    constructor(
        private dateService: DateService,
        private usageRequestService: UsageRequestService
    ) { }

    private getDictionary(data: Array<any>): any {
        const res = {};
        data.forEach((item: any) => {
            if (!this.usageRequestService.isUserInList(item.userId)) {
                return;
            }
            if (!res[item.userId]) {
                res[item.userId] = [];
            }
            res[item.userId].push(item);
        })
        return res;
    }

    private createSeries(obj: any): Array<any> {
        let res = [];
        Object.keys(obj).forEach((k) => {
            let ser = { name: obj[k][0].userName, series: [] };
            obj[k].forEach((item: any) => {
                ser.series.push({
                    value: item.count,
                    name: item.date
                });
            });
            ser.series = this.dateService.sortByMonthYear(ser.series, 'name');
            //alert(JSON.stringify(ser.series))
            res.push(ser)
        });

        return res;
    }

    transform(data: any, ...args: any[]): any {
        const res = {
            query: [],
            download: []
        }
        if (!data) { return res; }
        data = this.usageRequestService.createData(data);
        if (!data) { return res; }
        const newQuery = this.getDictionary(data.newQuery);
        const downloads = this.getDictionary(data.downloads);
        res.query = this.createSeries(newQuery);
        res.download = this.createSeries(downloads);
        return res;
    }
}