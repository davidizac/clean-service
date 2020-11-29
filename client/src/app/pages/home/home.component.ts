import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MyEvent } from 'src/app/services/myevents.service';

declare let $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

// 
export class HomeComponent implements OnInit {
  lang:string

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private myEvent: MyEvent
  ) { AOS.init(); }


  ngOnInit() {
    this.route.params.subscribe(value => {
      this.lang = value['lang']
      this.myEvent.setLanguageData(this.lang);
    })
    var navbar = $('.navbar');
    var navLink = $('.nav-link')
    var imgLogoWhite = $('#logoMenuWhite')
    var imgLogoBlue= $('#logoMenuBlue')
    var btnSignIn = $('.btnSignIn')


    $(window).scroll(function () {
      if ($(window).scrollTop() <= 400) {
        navbar.removeClass('navbar-scroll');
        navLink.removeClass('nav-link-scroll');
        imgLogoWhite.removeClass('d-none');
        imgLogoBlue.addClass('d-none')
        imgLogoBlue.removeClass('d-block');
        btnSignIn.removeClass('btnSignInScroll')

      } else  {
        navbar.addClass('navbar-scroll');
        navLink.addClass('nav-link-scroll');
        imgLogoWhite.addClass('d-none');
        imgLogoBlue.removeClass('d-none')
        imgLogoBlue.addClass('d-block')
        btnSignIn.addClass('btnSignInScroll')
      }
    });
  }




  goToLinkOfPath(path) {
    this.router.navigate([`/${path}`])
  }

}
