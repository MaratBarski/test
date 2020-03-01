import { Injectable } from '@angular/core';
import { enUS } from '../translations/enUS';

const TRANSLATIONS = {
  enUS: enUS
};

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private lang = 'enUS';
  constructor() { }

  private formatString(str: string, args: any[]): string {
    let formatted = str;
    for (var i = 0; i < args.length; i++) {
      var regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[i]);
    }
    return formatted;
  }

  translate(key: string, args: any[] = undefined): string {
    if (!TRANSLATIONS[this.lang]) { return key; }
    const translation = TRANSLATIONS[this.lang][key]
      ? TRANSLATIONS[this.lang][key]
      : key;
    return !!!args || !!!args.length ? translation :
      this.formatString(translation, args);
  }
}
