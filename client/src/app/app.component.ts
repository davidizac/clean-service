import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isAdmin: boolean;
  isAuthenticated: boolean;
  adminMode;
  user;
  selectedTab = '';
  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    public userService: UserService,
    public router: Router
  ) { }

  ngOnInit() {
    this.adminMode = localStorage.getItem('adminMode') === 'true';
    this.authService.userIsAuthenticated
      .pipe(
        switchMap((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            return this.authService.autoLogin();
          } else {
            return of(isAuthenticated);
          }
        }),
        switchMap((isAuthenticated: boolean) => {
          this.isAuthenticated = isAuthenticated;
          if (isAuthenticated) {
            return this.userService.isAdmin();
          } else {
            return of(false);
          }
        }),
        switchMap((isAdmin: boolean) => {
          this.isAdmin = isAdmin;
          if (this.isAuthenticated) {
            return this.userService.getMe();
          } else {
            return of();
          }
        })
      )
      .subscribe((user) => {
        this.user = user;
        this.cd.detectChanges();
      });
  }

  toggleAdminMode(e) {
    this.adminMode = e.checked;
    localStorage.setItem('adminMode', e.checked.toString());
    this.cd.detectChanges();
  }

  changedTab(tab) {
    this.selectedTab = tab;
  }
}
