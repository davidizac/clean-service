import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  isAdmin(): Observable<boolean> {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.get<boolean>(
          `${environment.serverUrl}api/users/is-admin`,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }

  createUser(email, fullname, phoneNumber) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.post(
          `${environment.serverUrl}api/users/`,
          {
            email,
            fullname,
            phoneNumber,
          },
          { headers: { authorization: token } }
        );
      })
    );
  }

  getMe() {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.get(`${environment.serverUrl}api/users/me`, {
          headers: { authorization: token },
        });
      })
    );
  }
}
