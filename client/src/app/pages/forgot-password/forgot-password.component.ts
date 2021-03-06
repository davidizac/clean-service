import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string;

  errorMessage;
  showMessage = false;
  lang:string

  constructor(
    private authService: AuthService,
    public router: Router,
    public userService: UserService,
    public route: ActivatedRoute,
    private myEvent:MyEvent
  ) {}

  ngOnInit(){
    this.route.params.subscribe(value => {
      this.lang = value['lang']
      this.myEvent.setLanguageData(this.lang);
    })
  }

  onSubmit() {
    this.authService.resetPassword(this.email).subscribe(() => {
      this.showMessage = true;
    });
  }
}
