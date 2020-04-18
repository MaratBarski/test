import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {
  }

  private createHeaders = (): any => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
  };

  get(url: string): any {
    return this.http.get(url, this.createHeaders());
  }

  post(url: string, data: any): any {
    return this.http.post(url, data, this.createHeaders());
  }

  put(url: string, data: any): any {
    return this.http.put(url, data, this.createHeaders());
  }

  delete(url: string): any {
    return this.http.delete(url, this.createHeaders());
  }
}
