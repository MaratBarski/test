import { Injectable } from '@angular/core';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { DataService } from '@appcore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditCategoryService {

  constructor(private dataService: DataService) { }

  @Offline('assets/offline/selectedHierarchy.json?')
  private getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}`;

  load(id: string): Observable<any> {
    return this.dataService.get(`${this.getUrl}/${id}`);
  }

  sortHierarchyLevels(categories: Array<any>): Array<any> {
    return categories.sort((a, b) => {
      return (a.sortValue === b.sortValue) ? 0 : (a.sortValue > b.sortValue) ? 1 : -1
    });
  }
}
