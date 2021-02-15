import { Injectable } from '@angular/core';
import { MyEvent } from './myevents.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  rtlSide = "ltr";

  constructor(
    private myEvent: MyEvent,
  ) {
    
  }

  languageObservable(){
    this.myEvent.getLanguageObservable().subscribe((value) => {
      // this.localize.changeLanguage(this.localize.parser.currentLang === 'fr' ? 'en' : 'fr');
      // this.router.navigate(["/en/home"]);
      this.setDirectionAccordingly(value);
    });
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case "il": {
        this.rtlSide = "rtl";
        break;
      }
      default: {
        this.rtlSide = "ltr";
        break;
      }
    }
  }
}
