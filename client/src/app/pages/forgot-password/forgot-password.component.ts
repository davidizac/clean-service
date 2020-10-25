import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(
    private authService: AuthService,
    public router: Router,
    public userService: UserService,
    public route: ActivatedRoute
  ) {}

  onSubmit() {
    this.authService.resetPassword(this.email).subscribe(() => {
      this.showMessage = true;
    });
  }
}
