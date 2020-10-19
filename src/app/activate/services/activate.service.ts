import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable, Subject} from 'rxjs';
import {FileSource} from '@app/imported-files/models/file-source';
import {environment} from '@env/environment';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ColumnType, DataService, NotificationsService, Project, ToasterType} from '@appcore';
import {HttpClient} from '@angular/common/http';
import {FieldDataType} from '@app/activate/model/enum/FieldDataType';
import {LoginService} from 'core';
import {ResearchService} from '@app/users/services/research.service';

export interface Research {
  approvalKey: string;
  approvalKeyExpirationDate: any;
  endDate: any;
  information: string
  insertDate: any;
  maxPatients: number;
  modifiedDate: any;
  project: Project;
  projectId: number;
  researchId: number;
  researchName: string;
  researchStatus: string;
  startDate: any;
  userId: number;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivateService implements Resolve<any> {
  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;
  private _onLoadFailed = new Subject();

  constructor(private dataService: DataService,
              private http: HttpClient,
              private notificationService: NotificationsService) {
  }

  get onLoadFailed(): Observable<any> {
    return this._onLoadFailed.asObservable();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const id = route.paramMap.get('fileId');
    // const anonymityRequest = route.paramMap.get('anonymityRequest');

    let fileSource: FileSource;
    this.getUrl = `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.file}/${id}`;
    return forkJoin([this.dataService.get(this.getUrl), this.getIRB()]).pipe(map((data: any) => {
         fileSource = data[0].data as FileSource;
         return [fileSource, data[1].data];
    }, catchError(e => {
      this._onLoadFailed.next();
      this.notificationService.addNotification({
        type: ToasterType.error,
        name: 'Failed to open file',
        showInToaster: true,
        comment: 'File not found. Please retry or contact MDClone support.'
      });
      return [];
    })));
  }

  getHierarchy(id: number): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}/${id}`;
    return this.dataService.get(this.getUrl).pipe(map((item: any) => {
      return item.data;
    }));
  }

  updateFileSourceState(fileId, state): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}/${fileId}`;
    return this.dataService.put(this.getUrl, state).pipe(map((item: any) => {
      return item.data;
    }));
  }

  downloadOriginalFile(fileId): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.originalFile}/${fileId}`;
    return this.http.get(this.getUrl, {responseType: 'blob', observe: 'response'});
  }

  nullsRate(fileId, anonymity) {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.nullsRate}/${fileId}/${anonymity}`;
    return this.http.get(this.getUrl);
  }

  getSampleData(fileId: number, colName: string, colType: FieldDataType, anonymityRequest = null) {
    this.getUrl = anonymityRequest ? `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.sampleData}/${fileId}/${colName}/${colType}/${anonymityRequest}` :
      `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.sampleData}/${fileId}/${colName}/${colType}`;
    return this.http.get(this.getUrl);
  }

  getIRB(): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.research}/get-irb-by-user`;
    return this.http.get(this.getUrl);
  }

  getCensoredRate(fileId, anonymityRequest) {
    this.getUrl = anonymityRequest ? `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.censoredRate}/${fileId}/${anonymityRequest}` :
      `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.censoredRate}/${fileId}`;
    return this.http.get(this.getUrl);
  }

  getCensoredFile(fileId, anonymityRequest) {
    this.getUrl = anonymityRequest ? `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.censoredFile}/${fileId}/${anonymityRequest}` :
      `${environment.serverUrl}${environment.endPoints.activate.base}${environment.endPoints.activate.censoredFile}/${fileId}`;
    return this.http.get(this.getUrl, {responseType: 'blob', observe: 'response'});
  }
}
