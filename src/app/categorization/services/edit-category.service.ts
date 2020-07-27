import { Injectable } from '@angular/core';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { DataService, ToasterType, NotificationsService, INotification } from '@appcore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EditCategoryService {

  constructor(
    private router: Router,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) { }

  @Offline('assets/offline/selectedHierarchy.json?')
  private getUrl = `${environment.serverUrl}${environment.endPoints.hierarchy}`;

  private saveUrl = `${environment.serverUrl}${environment.endPoints.updateHierarchy}`;

  load(id: string): Observable<any> {
    return this.dataService.get(`${this.getUrl}/${id}`).pipe(
      map((res: any) => {
        if (!res || !res.data) {
          this.router.navigateByUrl('/categorization');
        }
        return res;
      }),
      catchError(er => {
        this.router.navigateByUrl('/categorization');
        return undefined;
      })
    );
  }

  save(category: any, hierarchyRootId: number): Observable<any> {
    return this.dataService.put(`${this.saveUrl}/${hierarchyRootId}`, category).pipe(
      catchError(er => {
        this.notificationService.addNotification({
          type: ToasterType.error,
          name: 'Failed to save Categorization',
          comment: 'Try again or contact MDClone support.',
          showInToaster: true
        })
        return of(er);
      })
    );
  }

  sortHierarchyLevels(categories: Array<any>): Array<any> {
    return categories.sort((a, b) => {
      return (a.sortValue === b.sortValue) ? 0 : (a.sortValue > b.sortValue) ? 1 : -1
    });
  }
}
