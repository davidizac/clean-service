import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { AuthService } from 'src/app/services/auth.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user;
  lastName = '';
  firstName = '';
  lang:string
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private myEvent:MyEvent,
    private localize: LocalizeRouterService
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe(value => {
    //   this.lang = value['lang']
    //   this.myEvent.setLanguageData(this.lang);
    // })
    this.myEvent.setLanguageData(this.localize.parser.currentLang);
    this.userService.getMe().subscribe((user) => {
      this.user = user;
      try {
        this.firstName = this.user.fullname.split(' ')[0];
        this.lastName = this.user.fullname.split(' ')[1];
      } catch {
        this.firstName = this.user.fullname;
      }
    });
  }

  logout() {
    this.authService.logout();
    const route = this.localize.translateRoute(`/home`);
    this.router.navigate([route]);
  }
}
