import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
import 'aos/dist/aos.css';

declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('adminMode') adminMode : any
  @Input('isAuthenticated') isAuthenticated : any
  @Input('user') user : any
  @Input('isAdmin') isAdmin : any

  selectedTab = 'home'
  

  constructor(public cd: ChangeDetectorRef, public router: Router) {AOS.init(); }

  toggleAdminMode(e) {
    this.adminMode = e.checked;
    localStorage.setItem('adminMode', e.checked.toString());
    this.cd.detectChanges();
  }

  changedTab(tab) {
    this.selectedTab = tab;
  }

  ngOnInit() {

    this.adminMode = localStorage.getItem('adminMode') === 'true';
    console.log(this.isAuthenticated)
    //  $(window).on('scroll', function() {
    //  console.log("broker");

    // });

    // $(window).on('scroll', function() {
    //   //alert('out reached');
    //     if($(window).scrollTop() + $('.navbar-collapse').height() - 1726 >= $('.navbar-collapse')[0].scrollHeight) {
    //       console.log("from broker");

    //         $('.navbar-collapse').css({'position':'fixe', 'top':'0'});
    //     } else{
    //       $('.navbar-collapse').css({'position':'sticky', 'top':'327'});
    //     }
    // });

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