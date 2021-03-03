import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private localize: LocalizeRouterService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAuthenticated.pipe(
      switchMap((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          const route = this.localize.translateRoute('/signin');
          this.router.navigate([route], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
        return true;
      })
    );
  }
}
