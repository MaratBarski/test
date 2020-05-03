import { Injectable } from '@angular/core';
import { DataService, BaseSibscriber } from '@appcore';
import { Offline } from '../decorators/offline.decorator';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseSibscriber {

  config: any;
  isLoaded = false;

  @Offline('assets/offline/config.json')
  private getUrl = `${environment.serverUrl}${environment.endPoints.config}`;

  constructor(private dataService: DataService) {
    super();
    this.loadConfig();
  }

  loadConfig(): void {
    super.add(
      this.dataService.get(this.getUrl).subscribe((res: any) => {
        this.config = res.data;
        this.isLoaded = true;
      }));
  }
}
