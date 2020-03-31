import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(
    private http: HttpClient
  ) {
  } 
  download(url:string): void{
    window.open(url);
  } 
}