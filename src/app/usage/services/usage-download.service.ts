import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsageDownloadService {
  toCSV: any = () => { };
  toPDF: any = () => { };
  constructor() { }
}
