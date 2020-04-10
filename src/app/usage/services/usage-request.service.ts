import { Injectable } from '@angular/core';
import { DateService, DatePeriod } from '@app/core-api';
import { UsageReportParams } from '../models/usage-request';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsageRequestService {
  get usageRequest(): UsageReportParams {
    return this._usageRequest;
  }
  private _usageRequest: UsageReportParams;
  constructor(
    private dateService: DateService
  ) {
    this.reset();
  }
  get onChange(): Observable<void> {
    return this._onChange.asObservable();
  }
  private _onChange = new Subject<void>();

  emit(): void {
    this._onChange.next();
  }

  reset(): void {
    this._usageRequest = {
      environmet: '',
      includeAdmin: false,
      fromDate: this.dateService.formatDate(this.dateService.fromYear(0)),
      //fromDate: this.dateService.formatDate(this.dateService.fromDate[DatePeriod.Month](12)),
      toDate: this.dateService.formatDate(this.dateService.fromDate[DatePeriod.Month](0)),
      users: []
    }
  }
}
