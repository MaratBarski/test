import { Injectable } from '@angular/core';
import { DateService, BaseSibscriber, DataService, LoginService, SortService } from '@appcore';
import { UsageReportParams } from '../models/usage-request';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export class UsageQueryParams {
  environment?: string;
  years: string;
  includeAdmin: string;
}

export function DEFUULT_PARAMS(): UsageQueryParams {
  return { includeAdmin: 'false', years: '0' };
}

@Injectable({
  providedIn: 'root'
})
export class UsageRequestService extends BaseSibscriber {
  get usageRequest(): UsageReportParams {
    return this._usageRequest;
  }
  private _usageRequest: UsageReportParams;
  currentDateIndex = 0;

  get users(): Array<any> {
    return this._users;
  }
  get environments(): Array<any> {
    return this._environments;
  }
  private _environments: Array<any>;
  private _users: Array<any>;

  get isLoading(): boolean {
    return !!this._environments;
  }

  updateUsers(users: Array<any>): void {
    this._users = users;
  }

  isUserInList(userId: number): boolean {
    return this.usageRequest.users.find(x => x === userId);
  }

  private queryParams: UsageQueryParams;

  get onParams(): Observable<UsageQueryParams> {
    return this._onParams.asObservable();
  }

  private _onParams = new BehaviorSubject<UsageQueryParams>(DEFUULT_PARAMS());

  constructor(
    private dateService: DateService,
    private dataService: DataService,
    private loginService: LoginService,
    private sortService: SortService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.loadData();
    this.reset();
    super.add(
      this.activatedRoute.queryParams.subscribe(p => {
        this.queryParams = p as any;
        this._onParams.next(this.queryParams)
      }));
  }

  get onChange(): Observable<void> {
    return this._onChange.asObservable();
  }
  private _onChange = new Subject<void>();

  get onIncludeAdmin(): Observable<void> {
    return this._onIncludeAdmin.asObservable();
  }
  private _onIncludeAdmin = new Subject<void>();

  get onSelectUserChange(): Observable<void> {
    return this._onSelectUserChange.asObservable();
  }
  private _onSelectUserChange = new Subject<void>();

  userSelectChanged(): void {
    this._onSelectUserChange.next();
  }

  get onUsersLoaded(): Observable<void> {
    return this._onUsersLoaded;
  }
  private _onUsersLoaded = new Subject<void>();

  get onUsersFirstTimeSelected(): Observable<void> {
    return this._onUsersFirstTimeSelected;
  }
  private _onUsersFirstTimeSelected = new Subject<void>();

  firstTimeSeleted(): void {
    this._onUsersFirstTimeSelected.next();
  }

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
      environment: '',
      includeAdmin: false,
      fromDate: this.dateService.formatDateUS(dateRange.fromDate),
      toDate: this.dateService.formatDateUS(dateRange.toDate),
      users: []
    }
  }

  initUsers(response: any): void {
    if (!response.data) {
      this._users = [];
      return;
    }
    const data = this.createData(response.data);
    const users = {};
    Object.keys(data).forEach(k => {
      data[k].forEach((item: any) => {
        if (!users[item.userId]) {
          users[item.userId] = {
            login: item.userName,
            id: item.userId,
            total: 0
          }
        }
        users[item.userId].total += item.count;
      });
    });
    this._users = [];
    Object.keys(users).forEach(k => {
      this._users.push({ ...users[k], isChecked: false });
    });
    this._users = this._users.sort((a, b) => {
      return a.total > b.total ? -1 : 1;
    });
    this._onUsersLoaded.next();
  }

  initSummaryUsers(response: any): void {
    if (!response.data) {
      this._users = [];
      return;
    }
    const data = this.createData(response.data);
    this._users = data.map((x: any) => {
      return {
        isChecked: true,
        id: x.userId,
        login: x.userName,
        total: x.origin + x.syntetic
      }
    });
    this._users = this._users.sort((a, b) => {
      return a.total > b.total ? -1 : 1;
    })
    this._onUsersLoaded.next();
  }

  getUserById(id: any): any {
    return this._users.find(x => x.id === id);
  }

  loadEnvironments(): void {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this._environments = ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId, value: x };
        }).sort((a, b) => {
          return this.sortService.compareString(a.text, b.text, 'asc');
        });
      }));
  }

  getEnironment(): any {
    const env = this._environments.find(x => x.id === this.usageRequest.environment);
    return env ? { id: env.id, name: env.text } : { id: '0', name: 'All Environments' };
  }

  private loadData(): void {
    this.loadEnvironments();
  }

  createData(data: any): any {
    if (typeof (data) === 'string') {
      return JSON.parse(data);
    }
    return data;
  }

  distinctDate(arr: any, dateField: string, countField: string): Array<any> {
    const dict = {};
    arr.forEach((x: any) => {
      if (!dict[x[dateField]]) {
        dict[x[dateField]] = { name: x[dateField], value: 0 }
      }
      dict[x[dateField]].value += x[countField];
    });
    const res = [];
    Object.keys(dict).forEach(k => {
      res.push(dict[k]);
    });
    res.sort((a, b) => {
      return (a.value > b.value) ? -1 : 1;
    });
    return res;
  }

  distinctSeries(arr: any, key: string = 'date'): Array<any> {
    const dict = {};
    arr.forEach((x: any) => {
      if (!dict[x[key]]) {
        dict[x[key]] = {
          name: x[key], series: [
            { name: 'syntetic', value: 0 },
            { name: 'origin', value: 0 }
          ]
        }
      }
      dict[x[key]].series[0].value += x.syntetic;
      dict[x[key]].series[1].value += x.origin;
    });
    const res = [];
    Object.keys(dict).forEach(k => {
      res.push(dict[k]);
    });
    res.sort((a, b) => {
      return (a.value > b.value) ? -1 : 1;
    });
    return res;
  }
}
