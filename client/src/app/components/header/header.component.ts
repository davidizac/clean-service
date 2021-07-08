import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { DropdownModule } from 'primeng/dropdown';
import { MyEvent } from 'src/app/services/myevents.service';

declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {

  adminMode: any
  @Input('isAuthenticated') isAuthenticated: any
  @Input('user') user: any
  @Input('isAdmin') isAdmin: any

  selectedTab = 'home'
  selectedLang = 'FR'
  langs


  constructor(public cd: ChangeDetectorRef, public router: Router, private localize: LocalizeRouterService, private myEvent: MyEvent) {
    AOS.init();
    this.langs = [
      { name: 'Francais', code: 'FR' },
      { name: 'Anglais', code: 'EN' },
      { name: 'Israelien', code: 'IL' },
    ];
    var pathName = window.location.pathname.split('/')
    this.selectedTab = pathName[pathName.length - 1]

    router.events.subscribe(() => {      
      var pathName = window.location.pathname.split('/')[2]
      this.changedTab(pathName)
    });
  }

  toggleAdminMode(e) {
    this.adminMode = e.checked;
    localStorage.setItem('adminMode', e.checked.toString());
    this.cd.detectChanges();
  }

  chooseLang(lang) {
    this.localize.changeLanguage(lang);
    this.myEvent.setLanguageData(lang);
  }

  changedTab(tab) {
    if (!tab) {
      tab = 'home'
    }
    this.selectedTab = tab;
    if (tab === 'signin') {
      document.getElementById('header').classList.add('undisplay')
    } else {
      document.getElementById('header').classList.remove('undisplay')
    }
    console.log(this.selectedTab)
  }

  getImageLocation(country) {
    return `../../../assets/images/${country}.png`
  }

  ngOnChanges() {

    this.adminMode = localStorage.getItem('adminMode') === 'true';
    console.log(this.isAuthenticated)
    console.log(this.isAdmin, this.isAuthenticated)

    var navbar = $('.navbar');
    var navLink = $('.nav-link')
    var btnLang = $('.btnLang')
    var imgLogoWhite = $('#logoMenuWhite')
    var imgLogoBlue = $('#logoMenuBlue')
    var btnSignIn = $('.btnSignIn')


    $(window).scroll(function () {
      if ($(window).scrollTop() <= 400) {
        navbar.removeClass('navbar-scroll');
        navLink.removeClass('nav-link-scroll');
        btnLang.removeClass('btnLang-scroll');
        imgLogoWhite.removeClass('d-none');
        imgLogoBlue.addClass('d-none')
        imgLogoBlue.removeClass('d-block');
        btnSignIn.removeClass('btnSignInScroll')

      } else {
        navbar.addClass('navbar-scroll');
        navLink.addClass('nav-link-scroll');
        btnLang.addClass('btnLang-scroll');
        imgLogoWhite.addClass('d-none');
        imgLogoBlue.removeClass('d-none')
        imgLogoBlue.addClass('d-block')
        btnSignIn.addClass('btnSignInScroll')
      }
    });
  }




  goToLinkOfPath(path) {
    const route = this.localize.translateRoute(`/${path}`);
    this.router.navigate([route])
  }


}
