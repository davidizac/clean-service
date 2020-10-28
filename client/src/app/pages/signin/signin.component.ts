import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(
    private authService: AuthService,
    public router: Router,
    public userService: UserService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
      authObs = this.authService
        .signup(email, password)
        .pipe(
          switchMap((res) =>
            this.userService.createUser(email, fullname, phoneNumber)
          )
        );
    }
    authObs.subscribe(
      (resData) => {
        this.router.navigateByUrl(this.returnUrl);
      },
      (errRes) => {
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

  onSubmit() {
    this.authenticate(
      this.email,
      this.password,
      this.fullname,
      this.phoneNumber
    );
  }
}
