import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pressing } from '../models/pressing.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PressingService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createPressing(pressing: Pressing, latitude, longitude) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.post(
          `${environment.serverUrl}api/pressings/`,
          Object.assign(pressing, { latitude, longitude }),
          { headers: { authorization: token } }
        );
      })
    );
  }

  getAllPressings() {
    return this.http.get(`${environment.serverUrl}api/pressings/`);
  }

  getPressing(id): Observable<Pressing> {
    return this.http.get<Pressing>(
      `${environment.serverUrl}api/pressings/${id}`
    );
  }
}
