import { Injectable } from '@angular/core';
import { DataService, BaseSibscriber } from '@appcore';
import { Offline } from '../decorators/offline.decorator';
import { environment } from '@env/environment';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseSibscriber {

  config: any;
  serverConfig: any;

  readonly configDictionary = {
    E00014: 'noUtf8',
    E00021: 'noHebrewHeaders',
    E00009: 'csvExtensionError',
    E00012: 'headerEmptyError',
    E00022: 'nullOnHeadersError',
    E00011: 'fileEmpty',
    E00023: 'noName',
    E00019: 'noRows'
  }

  get isLoaded(): boolean { return this._isLoaded; }
  private _isLoaded = false;

  get dateFormat(): string { return this._dateFormat; }
  private _dateFormat = 'dd/mm/yy'

  private clientUrl = 'assets/offline/config.json';

  @Offline('assets/offline/serverConfig.json')
  private serverUrl = `${environment.serverUrl}${environment.endPoints.config}`;


  constructor(private dataService: DataService) {
    super();
    this.loadConfig();
  }

  loadConfig(): void {
    super.add(
      forkJoin(
        this.dataService.get(this.clientUrl),
        this.dataService.get(this.serverUrl))
        .subscribe(([client, server]: any) => {
          this._isLoaded = true;
          this.config = client.data;
          this.serverConfig = server.data;
          const dateParam = server.data.config.find(x => x.parameterName === 'date_format');
          if (dateParam && dateParam.parameterValue === 'US') {
            this._dateFormat = 'mm/dd/yy';
          } else {
            this._dateFormat = 'dd/mm/yy';
          }
          this.updateClientMessages();
        }, error => {
          console.error('Error loading configuration.');
        }));
  }

  private updateClientMessages(): void {
    if (!this.serverConfig.msg) { return; }
    this.serverConfig.msg.forEach((elm: any) => {
      if (this.configDictionary[elm.msgCode]) {
        this.config.fileValidationErrors[this.configDictionary[elm.msgCode]] = elm.msgOut;
      }
    });
  }
}
