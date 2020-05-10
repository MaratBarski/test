import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';

@Pipe({ name: 'generalChart' })
export class GeneralChartPipe implements PipeTransform {
    constructor(private usageRequestService: UsageRequestService) { }
    transform(arr: Array<any>, ...args: any[]): any {
        if (!arr) { return []; }
        //alert('pipe:+' + this.usageRequestService.usageRequest.includeAdmin)
        return arr.map(x => {
            return {
                name: x.date,
                value: x.count
            };
        })
    }
}