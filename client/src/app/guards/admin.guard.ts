import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAdmin().pipe(
      switchMap((isAdmin) => {
        if (!isAdmin) {
          return this.authService.autoLogin();
        } else {
          return of(isAdmin);
        }
      }),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigate(['./signin']);
          return false;
        }
        if (isAdmin && localStorage.getItem('adminMode') === 'false') {
          this.router.navigate(['./home']);
          return false;
        }
        return true;
      })
    );
  }
}
