import { Injectable } from '@angular/core';
import { DateService, DatePeriod, BaseSibscriber, DataService, LoginService } from '@appcore';
import { UsageReportParams } from '../models/usage-request';
import { Subject, Observable } from 'rxjs';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UsageRequestService extends BaseSibscriber {
  get usageRequest(): UsageReportParams {
    return this._usageRequest;
  }
  private _usageRequest: UsageReportParams;

  get users(): Array<any> {
    return this._users;
  }
  get environments(): Array<any> {
    return this._environments;
  }
  private _environments: Array<any>;
  private _users: Array<any>;

  get isLoading(): boolean {
    return !!this._users && !!this._environments;
  }

  constructor(
    private dateService: DateService,
    private dataService: DataService,
    private loginService: LoginService
  ) {
    super();
    this.loadData();
    this.reset();

    // const d = this.dateService.getFromYear(0);
    // const str = `${this.dateService.formatDate(d.fromDate)} to ${this.dateService.formatDate(d.toDate)}`
    // alert(str);

    // const d = this.dateService.getFromMonth2Current(13);
    // const str = `${this.dateService.formatDate(d.fromDate)} to ${this.dateService.formatDate(d.toDate)}`
    // alert(str);
  }
  get onChange(): Observable<void> {
    return this._onChange.asObservable();
  }
  private _onChange = new Subject<void>();

  get onIncludeAdmin(): Observable<void> {
    return this._onIncludeAdmin.asObservable();
  }
  private _onIncludeAdmin = new Subject<void>();

  emit(): void {
    this._onChange.next();
  }

  includeAdmin(includeAdmin: boolean): void {
    this.usageRequest.includeAdmin = includeAdmin;
    this._onIncludeAdmin.next();
  }

  reset(): void {
    const dateRange = this.dateService.getFromMonth2Current(13);
    this._usageRequest = {
      environmet: '',
      includeAdmin: false,
      fromDate: this.dateService.formatDate(dateRange.fromDate),
      toDate: this.dateService.formatDate(dateRange.toDate),
      users: []
    }
  }

  @Offline('assets/offline/users.json?')
  private getUsersUrl = `${environment.serverUrl}${environment.endPoints.usageReport}`;
  loadUsers(): void {
    super.add(
      this.dataService.get(this.getUsersUrl).subscribe((users: Array<any>) => {
        this._users = users.filter(x => x.id);
      }));
  }

  loadEnvironments(): void {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this._environments = ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId, value: x };
        });
      }));
  }

  getEnironment(): any {
    return { id: '0', name: 'All Environments', ...this._environments.find(x => x.id === this.usageRequest.environmet) };
  }

  private loadData(): void {
    this.loadUsers();
    this.loadEnvironments();
  }
}
