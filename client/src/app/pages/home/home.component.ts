import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import * as _ from 'lodash';
import { switchMap } from 'rxjs/operators';
import { Pressing } from 'src/app/models/pressing.model';
import { PressingService } from 'src/app/services/pressing.service';
import { UserService } from 'src/app/services/user.service';

declare let $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

// 
export class HomeComponent implements OnInit {
  pressings;
  fourPressingDisplayed

  constructor(
    public router: Router,
    public pressingService: PressingService,
    private userService: UserService,
    public ngZone: NgZone,
  ) { AOS.init(); }


  ngOnInit() {


    this.pressingService
      .getAllPressings()
      .pipe(
        switchMap((pressings: Array<Pressing>) => {
          this.pressings = pressings.map((p) => new Pressing(p));
          this.fourPressingDisplayed = _.cloneDeep(this.pressings).splice(
            0,
            this.pageSize
          );
          this.fourPressingDisplayed = this.fourPressingDisplayed.slice(0,4)
          return this.fourPressingDisplayed
        })
      )


    var navbar = $('.navbar');
    var navLink = $('.nav-link')
    var imgLogoWhite = $('#logoMenuWhite')
    var imgLogoBlue = $('#logoMenuBlue')
    var btnSignIn = $('.btnSignIn')


    $(window).scroll(function () {
      if ($(window).scrollTop() <= 400) {
        navbar.removeClass('navbar-scroll');
        navLink.removeClass('nav-link-scroll');
        imgLogoWhite.removeClass('d-none');
        imgLogoBlue.addClass('d-none')
        imgLogoBlue.removeClass('d-block');
        btnSignIn.removeClass('btnSignInScroll')

      } else {
        navbar.addClass('navbar-scroll');
        navLink.addClass('nav-link-scroll');
        imgLogoWhite.addClass('d-none');
        imgLogoBlue.removeClass('d-none')
        imgLogoBlue.addClass('d-block')
        btnSignIn.addClass('btnSignInScroll')
      }
    });
  }
  pageSize(arg0: number, pageSize: any): any {
    throw new Error('Method not implemented.');
  }


  navigateToPressing(pressingId) {
    this.ngZone.run(() => {
      this.router.navigate([`./pressings/${pressingId}`]);
    });
  }


  goToLinkOfPath(path) {
    this.router.navigate([`/${path}`])
  }

}
