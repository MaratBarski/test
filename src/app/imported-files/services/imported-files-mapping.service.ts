import { Injectable } from '@angular/core';
import { DataService, NotificationsService, ToasterType } from '@appcore';
import { Observable, Subject } from 'rxjs';
import { FileSource, FileSourceMappingResponse } from '../models/file-source';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '@env/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Template } from '@app/models/template';


@Injectable({
  providedIn: 'root'
})
export class ImportedFilesMappingService implements Resolve<FileSourceMappingResponse> {

  constructor(
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {

  }

  get onMapFinish(): Observable<any> {
    return this._onMapFinish.asObservable();
  }

  private _onMapFinish = new Subject<any>();

  mapFinish(state: { fileID: any, status: string }): void {
    this._onMapFinish.next(state);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    let fileSource: FileSource;
    let templates: Template[];

    this.getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}/${id}`;
    //this.getUrl = 'assets/offline/selectedFileSource.json';

    return this.dataService.get(this.getUrl).pipe(map((data: any) => {
      fileSource = data.data as FileSource;
      return fileSource;
    }), switchMap((data: FileSource) => {
      this.getUrl = `${environment.serverUrl}${environment.endPoints.templateByProject}/${data.project}`;
      //this.getUrl = 'assets/offline/templateByProject.json';
      return this.dataService.get(this.getUrl);
    }), map((data: any) => {
      templates = data.data as Template[];
      return templates;
    }), switchMap((data: Template[]) => {
      this.getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}/project/${fileSource.project}`;
      //this.getUrl = 'assets/offline/hierarchyProject.json'
      return this.dataService.get(this.getUrl);
    }), map((data: any) => {
      return [fileSource, templates, data.data];
    }), catchError(e => {
      this.notificationService.addNotification({
        type: ToasterType.error,
        name: 'Failed to open file',
        showInToaster: true,
        comment: 'File not found. Please retry or contact MDClone support.'
      })
      return [];
    }));
  }

  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;

  load(): Observable<FileSourceMappingResponse> {
    return this.dataService.get(this.getUrl);
  }

  checkRelationalIntegrity(opt: any): Observable<any> {
    const payload = {
      hierarchyId: opt.hierarchyId,
      colIndex: opt.colIndex,
      fileName: opt.fileName,
      filePath: opt.filePath,
      numOfCols: opt.numOfCols,
      fileId: opt.fileId,
    }
    this.getUrl = `${environment.serverUrl}${environment.endPoints.getRelationalIntegrity}`;
    return this.dataService.post(this.getUrl, payload);
  }

  getSampleData(opt: any): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.getSampleData}`;
    return this.dataService.post(this.getUrl, opt);
  }

  saveMappedData(opt: any): Observable<any> {
    this.getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;
    this.notificationService.addNotification({
      type: ToasterType.infoProgressBar,
      name: 'File source mapping',
      comment: `Mapping of ${opt.fileName}.`,
      progress: 0,
      key: opt.key,
      showInToaster: true,
      containerEnable: true,
      abortName: 'Aborted Successfully',
      abortComment: `Mapping of ${opt.fileName} was successfully aborted.`,
      onComplete: () => {
        this.mapFinish({ fileID: opt.fileId, status: 'Completed' });
      }
    });
    return this.dataService.put(this.getUrl, opt);
  }
}
