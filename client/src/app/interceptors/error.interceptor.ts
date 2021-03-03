import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router,private localize: LocalizeRouterService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
     if (err.status === 400) {
      const route = this.localize.translateRoute('/bad-request');
       this.router.navigate([route], { skipLocationChange: true });
     } else if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authService.logout();
      } else if (err.status === 403) {
        const route = this.localize.translateRoute('/signin');
        this.router.navigate([route]);
      } else if (err.status === 404) {
        const route = this.localize.translateRoute('/404');
        this.router.navigate([route], { skipLocationChange: true });
      }
      return throwError(err);
    }));
  }
}
