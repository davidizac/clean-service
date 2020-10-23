import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
     if (err.status === 400) {
       this.router.navigate(['/bad-request'], { skipLocationChange: true });
     } else if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authService.logout();
      } else if (err.status === 403) {
        this.router.navigate(['/signin']);
      } else if (err.status === 404) {
        this.router.navigate(['/404'], { skipLocationChange: true });
      }
      return throwError(err);
    }));
  }
}
