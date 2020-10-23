import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    this.router.navigate(['./home']);
  }
}
