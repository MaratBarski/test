import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';

@Pipe({ name: 'userActivityChart' })
export class UserActivityChartPipe implements PipeTransform {
    constructor(private usageRequestService: UsageRequestService) { }
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