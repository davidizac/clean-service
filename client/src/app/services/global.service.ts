import { Injectable } from '@angular/core';
import { MyEvent } from './myevents.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  rtlSide = "ltr";
  langGlobal: string;


  constructor(
    private myEvent: MyEvent,
  ) {

  }

  languageObservable() {
    this.myEvent.getLanguageObservable().subscribe((value) => {
      // this.localize.changeLanguage(this.localize.parser.currentLang === 'fr' ? 'en' : 'fr');
      // this.router.navigate(["/en/home"]);
      this.setDirectionAccordingly(value);
    });
  }

  setDirectionAccordingly(lang: string) {
    this.langGlobal = lang
    if (lang == 'il') {
      this.rtlSide = "rtl";
    }
    else if (lang == 'fr' || lang == 'en') {
      this.rtlSide = "ltr";
    }
  }
}
