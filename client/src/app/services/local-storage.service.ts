import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public getItem(key: string) {
    return localStorage.getItem(key);
  }

  public setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  public removeItem(key: string) {
    return localStorage.removeItem(key);
  }

  public clear() {
    return localStorage.clear();
  }
}
 