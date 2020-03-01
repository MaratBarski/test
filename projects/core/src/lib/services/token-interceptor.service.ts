import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (LoginService.IS_LOGEDIN()) {
      request = request.clone({
        setHeaders: {
          Authorization: LoginService.getToken()
        }
      });
    }
    return (next.handle(request) as any).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { 
          this.loginService.logOut();
          return of('Unauthorized');
        }
        return throwError(error);
      }));
  }
}
