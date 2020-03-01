import { Injectable } from '@angular/core';
import { DataService } from '../../core-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesService {

  constructor(
    private http: HttpClient,
    private dataService: DataService) { }

  load(): Observable<any> {
    //alert(`${environment.serverUrl}mdclone/api/v1/file-source`)
    //return this.dataService.get(`${environment.serverUrl}mdclone/api/v1/file-source`);
    return this.http.get('http://localhost:4200/assets/offline/fileSource.json');
  }
}
