import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';

@Pipe({ name: 'createdChart' })
export class CreatedChartPipe implements PipeTransform {
    constructor(private usageRequestService: UsageRequestService) { }
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