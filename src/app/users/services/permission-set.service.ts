import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';

export class PermissionSet {
  isNew: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionSetService {

  constructor(
    private http: HttpClient
  ) {
    this._permissionSet = this.getDefault();
    this.loadData();
  }

  private _permissionSet: PermissionSet;
  private _dataLoaded = false;
  private _researchers: Array<any>;

  get permissionSet(): PermissionSet {
    return this._permissionSet;
  }

  get dataLoaded(): boolean {
    return this._dataLoaded;
  }

  get researchers(): Array<any> {
    return this._researchers;
  }

  getDefault(): PermissionSet {
    return {
      isNew: true
    }
  }

  @Offline('assets/offline/research.json')
  private getResearchUrl = `${environment.serverUrl}${environment.endPoints.research}`;


  loadData(): void {
    this._dataLoaded = false;
    this.http.get(this.getResearchUrl).subscribe((res: any) => {
      this._researchers = res.data
      this._dataLoaded = true;
    })
  }

  getResearchers(): Array<any> {
    return this._researchers.map((x: any) => {
      return {
        researchName: x.researchName,
        user: `${x.user.firstName} ${x.user.lastName}`,
        name: `${x.researchName} ${x.user.firstName} ${x.user.lastName}`
      };
    })
  }
}
