import { Injectable } from '@angular/core';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { DataService } from '@appcore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapCategoryService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/selectedHierarchy.json?')
  private getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}`;
  
  load(): Observable<any> {
    return this.dataService.get(this.getUrl);
  }
}
