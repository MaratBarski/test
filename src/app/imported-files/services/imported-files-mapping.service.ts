import {Injectable} from '@angular/core';
import {DataService, TableModel} from '@appcore';
import {forkJoin, Observable, of} from 'rxjs';
import {FileSourceResponse, FileSource, FileSourceMappingResponse} from '../models/file-source';
import {Offline} from 'src/app/shared/decorators/offline.decorator';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {environment} from '@env/environment';
import {map, switchMap} from 'rxjs/operators';
import {Template} from '@app/models/template';
import {temporaryAllocator} from '@angular/compiler/src/render3/view/util';
import {Hierarchy} from '@app/models/hierarchy';

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesMappingService implements Resolve<FileSourceMappingResponse> {

  constructor(private dataService: DataService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
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
    }));
  }

  @Offline('assets/offline/fileSource.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.fileSource}`;

  load(): Observable<FileSourceMappingResponse> {
    return this.dataService.get(this.getUrl);
  }

  checkRelationalIntegrity(opt: any): Observable<any> {
    const payload = {
      hierarchyId: opt.hierarchyId,
      colIndex: opt.colId,
      fileName: opt.fileName,
      filePath: opt.filePath,
      numOfCols: opt.numOfCols
    }
    this.getUrl = `${environment.serverUrl}${environment.endPoints.getRelationalIntegrity}`;
    return this.dataService.post(this.getUrl, payload);
  }
}
