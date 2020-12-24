import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_CONFIG } from 'src/app/app.config';
import { Constants } from 'src/app/models/constants.model';
import { MyEvent } from 'src/app/services/myevents.service';


@Component({
  selector: 'app-select-language',
  templateUrl: './select-languages.component.html',
  styleUrls: ['./select-languages.component.scss'],
})
export class SelectLanguagesComponent implements OnInit {
  defaultLanguageCode;
  languages: Array<{ code: string, name: string }>;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private myEvent: MyEvent) {
    this.languages = this.config.availableLanguages;
    this.defaultLanguageCode = config.availableLanguages[0].code;
    let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
    if (defaultLang) this.defaultLanguageCode = defaultLang;
  }

  ngOnInit() {
  }

  onLanguageClick(language) {
    this.defaultLanguageCode = language.code;
  }

  languageConfirm() {
    this.myEvent.setLanguageData(this.defaultLanguageCode);
    window.localStorage.setItem(Constants.KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
  }
}
