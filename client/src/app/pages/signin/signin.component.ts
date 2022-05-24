import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  isSignin = true;
  email: string;
  password: string;
  fullname: string;
  returnUrl: string;
  phoneNumber: string;
  errorMessage;
  lang: string
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    public userService: UserService,
    public route: ActivatedRoute,
    private localize: LocalizeRouterService,
    private myEvent: MyEvent
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(value => {
    //   this.lang = value['lang']
    //   this.myEvent.setLanguageData(this.lang);
    // })
    this.myEvent.setLanguageData(this.localize.parser.currentLang);

    this.route.queryParams.subscribe((queryParam) => {
      this.returnUrl = queryParam.returnUrl || '/';
    });
  }

  toggle() {
    this.isSignin = !this.isSignin;
  }

  authenticate(
    email: string,
    password: string,
    fullname: string,
    phoneNumber: string
  ) {
    let authObs;
    if (this.isSignin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password, fullname, phoneNumber);
    }
    authObs.subscribe(
      (resData) => {
        this.isLoading = false
        if (this.returnUrl == '/') {
          const route = this.localize.translateRoute('/home');
          this.router.navigate([route]);
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      (errRes) => {
        this.isLoading = false
        const code = errRes.error.error.message;
        this.errorMessage = `Impossible de s'inscrire pour le moment, ressayez plus tard.`;
        if (code === 'EMAIL_EXISTS') {
          this.errorMessage = 'Cette email existe deja.';
        } else if (code === 'EMAIL_NOT_FOUND') {
          this.errorMessage = 'Addresse email introuvable.';
        } else if (code === 'INVALID_PASSWORD') {
          this.errorMessage = 'Mot de passe incorrect.';
        }
      }
    );
  }

  keyFunc(ev) {
    if (ev.key === 'Enter') {
      this.onSubmit()
    }
  }

  

  onSubmit(action?) {
    this.isLoading = true
    var checkBool
    if (action == 'signup') {
      checkBool = this.checkAllFieldsErr()
      if (checkBool) {
        this.isLoading = false
      }
    }

    if (!action || (action == 'signup' && !checkBool)) {
      this.authenticate(
        this.email,
        this.password,
        this.fullname,
        this.phoneNumber
      );
    }

  }

  checkAllFieldsErr() {
    var check = false
    if (!this.email || this.email.trim().length == 0) {
      document.getElementById("email")?.classList.add('errInput')
      check = true
    }else{
      document.getElementById("email")?.classList.remove('errInput')
    }

    if (!this.password || this.password.trim().length == 0) {
      document.getElementById("password")?.classList.add('errInput')
      check = true
    }else{
      document.getElementById("password")?.classList.remove('errInput')
    }

    if (!this.fullname || this.fullname.trim().length == 0) {
      document.getElementById("fullName")?.classList.add('errInput')
      check = true
    }else{
      document.getElementById("fullName")?.classList.remove('errInput')
    }

    if (!this.phoneNumber || this.phoneNumber.trim().length == 0) {
      document.getElementById("number")?.classList.add('errInput')
      check = true
    }else{
      document.getElementById("number")?.classList.remove('errInput')
    }

    return check
  }
}
