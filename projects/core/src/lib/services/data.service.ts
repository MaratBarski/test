import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  private createHeaders = (): any => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  get<T>(url: string): Observable<T> {
    return (this.http.get<T>(url, this.createHeaders()) as any) as Observable<T>;
  }

  post<T>(url: string, data: any): Observable<T> {
    return (this.http.post<T>(url, data, this.createHeaders()) as any) as Observable<T>;
  }

  put<T>(url: string, data: any): Observable<T> {
    return (this.http.put<T>(url, data, this.createHeaders()) as any)as Observable<T>;
  }

  delete<T>(url: string): Observable<T> {
    return (this.http.delete<T>(url, this.createHeaders()) as any) as Observable<T>;
  }
}
