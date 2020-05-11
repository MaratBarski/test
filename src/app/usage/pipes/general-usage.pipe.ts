import { Pipe, PipeTransform } from '@angular/core';
import { UsageRequestService } from '../services/usage-request.service';
import { DateService } from '@appcore';


@Pipe({ name: 'generalChart' })
export class GeneralChartPipe implements PipeTransform {
    constructor(
        private dateService: DateService,
        private usageRequestService: UsageRequestService
    ) { }
    transform(arr: Array<any>, ...args: any[]): any {
        if (!arr) { return []; }
        arr = this.usageRequestService.createData(arr);
        arr = this.usageRequestService.distinctDate(arr, 'date', 'count');
        return this.dateService.sortByMonthYear(arr, 'name');
    }
}