import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import * as _ from 'lodash';
import { switchMap } from 'rxjs/operators';
import { Pressing } from 'src/app/models/pressing.model';
import { GlobalService } from 'src/app/services/global.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { PressingService } from 'src/app/services/pressing.service';
import { UserService } from 'src/app/services/user.service';

declare let $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})

// 
export class HomeComponent implements OnInit {
  pressings;
  fourPressingDisplayed = []
  langs


  constructor(
    public router: Router,
    public pressingService: PressingService,
    private userService: UserService,
    public ngZone: NgZone,
    private localize: LocalizeRouterService,
    public globalService: GlobalService,
    private myEvent: MyEvent
  ) {
    AOS.init();
    this.langs = [
      { name: 'Francais', code: 'FR' },
      { name: 'Anglais', code: 'EN' },
      { name: 'Israelien', code: 'IL' },
    ];

  }


  ngOnInit() {
    this.pressingService
      .getAllPressings()
      .subscribe((pressings: Array<Pressing>) => {
        this.fourPressingDisplayed.push(...pressings.slice(0, 4))
      })


    var navbar = $('.navbar');
    var navLink = $('.nav-link')
    var imgLogoWhite = $('#logoMenuWhite')
    var imgLogoBlue = $('#logoMenuBlue')
    var btnSignIn = $('.btnSignIn')



    $(window).scroll(function () {
      // if ($(window).scrollTop() > 100 && $(window).scrollTop() <= 120) {
      //   navbar.addClass('opacityHeader0');
      // }

      if ($(window).scrollTop() <= 100) {
        navbar.removeClass('navbar-scroll');
        // navbar.removeClass('opacityHeader0');
        navLink.removeClass('nav-link-scroll');
        imgLogoWhite.removeClass('d-none');
        imgLogoBlue.addClass('d-none')
        imgLogoBlue.removeClass('d-block');
        btnSignIn.removeClass('btnSignInScroll')
        document.getElementById("containerBannerOffer")?.classList.remove('effectDownBanner')

      } else if ($(window).scrollTop() > 120) {
        // navbar.removeClass('opacityHeader0');
        navbar.addClass('navbar-scroll');
        navLink.addClass('nav-link-scroll');
        imgLogoWhite.addClass('d-none');
        imgLogoBlue.removeClass('d-none')
        imgLogoBlue.addClass('d-block')
        btnSignIn.addClass('btnSignInScroll')
        document.getElementById("containerBannerOffer")?.classList.add('effectDownBanner')
      }
    });
  }
  pageSize(arg0: number, pageSize: any): any {
    throw new Error('Method not implemented.');
  }


  navigateToPressing(pressingId) {
    this.ngZone.run(() => {
      const route = this.localize.translateRoute(`/pressings/${pressingId}`);
      this.router.navigate([route]);
    });
  }


  goToLinkOfPath(path) {
    const route = this.localize.translateRoute(`/${path}`);
    this.router.navigate([route])
  }

  chooseLang(lang) {
    this.localize.changeLanguage(lang);
    this.myEvent.setLanguageData(lang);
  }



}
