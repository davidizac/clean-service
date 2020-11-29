import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { APP_CONFIG, AppConfig } from "./app.config";
import { MyEvent } from './services/myevents.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  rtlSide = "left";
  isAdmin: boolean;
  isAuthenticated: boolean;
  adminMode;
  user;
  selectedTab = '';
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    public userService: UserService,
    public router: Router,
    private myEvent: MyEvent,
    private translate: TranslateService,
  ) { 
    this.myEvent.getLanguageObservable().subscribe((value) => {
      this.router.navigate(["/home"]);
      this.globalize(value);
    });
  }

  ngOnInit() {
    this.myEvent.setLanguageData('fr')
    this.selectedTab = 'home';
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
        }),
        tap((user) => {
          this.user = user;
        })
      )
      .subscribe(() => {
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

  globalize(languagePriority) {
    this.translate.setDefaultLang("en");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(
      languagePriority && languagePriority.length
        ? languagePriority
        : defaultLangCode
    );
    this.setDirectionAccordingly(
      languagePriority && languagePriority.length
        ? languagePriority
        : defaultLangCode
    );
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case "ar": {
        this.rtlSide = "rtl";
        break;
      }
      default: {
        this.rtlSide = "ltr";
        break;
      }
    }
  }
}
