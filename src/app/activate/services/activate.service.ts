import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {FileSource} from '@app/imported-files/models/file-source';
import {Template} from '@app/models/template';
import {environment} from '@env/environment';
import {catchError, map, switchMap} from 'rxjs/operators';
import {DataService, NotificationsService, ToasterType} from '@appcore';
import {Hierarchy} from '@app/models/hierarchy';

@Injectable({
  providedIn: 'root'
})
export class ActivateService implements Resolve<any> {
  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;
  private _onLoadFailed = new Subject();

  constructor(private dataService: DataService,
              private notificationService: NotificationsService) {
  }

  get onLoadFailed(): Observable<any> {
    return this._onLoadFailed.asObservable();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('fileId');
    let fileSource: FileSource;
    let templates: Template[];

    this.getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}/${id}`;

    return this.dataService.get(this.getUrl).pipe(map((data: any) => {
      fileSource = data.data as FileSource;
      return fileSource;
    }), switchMap((data: FileSource) => {
      this.getUrl = `${environment.serverUrl}${environment.endPoints.templateByProject}/${data.project}`;
      return this.dataService.get(this.getUrl);
    }), map((data: any) => {
      templates = data.data as Template[];
      return templates;
    }), switchMap((data: Template[]) => {
      this.getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}/project/${fileSource.project}`;
      return this.dataService.get(this.getUrl);
    }), map((data: any) => {
      return [fileSource, templates, data.data];
    }), catchError(e => {
      this._onLoadFailed.next();
      this.notificationService.addNotification({
        type: ToasterType.error,
        name: 'Failed to open file',
        showInToaster: true,
        comment: 'File not found. Please retry or contact MDClone support.'
      });
      return [];
    }));
  }

  getHierarchy(id: number): Observable<Hierarchy> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}/${id}`;
    return this.dataService.get(this.getUrl);
  }
}
