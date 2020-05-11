import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';

@Pipe({ name: 'userActivityChart' })
export class UserActivityChartPipe implements PipeTransform {
    constructor(private usageRequestService: UsageRequestService) { }

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

    private getDate(str: string): Date {
        const arr = str.split('-');
        const date = new Date();
        date.setFullYear(2000 + parseInt(arr[1]));
        date.setDate(1);
        return date;
    }

    private createSeries(obj: any): Array<any> {
        let res = [];
        Object.keys(obj).forEach((k) => {
            let ser = { name: obj[k][0].userName, series: [] };
            obj[k].forEach((item) => {
                ser.series.push({
                    value: item.count,
                    name: item.date
                });
            });
            // ser.series = ser.series.sort((a, b) => {
            //     const d1 = this.getDate(a.name);
            //     const d2 = this.getDate(a.name);
            //     return d1 < d2 ? -1 : 1;
            // });
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