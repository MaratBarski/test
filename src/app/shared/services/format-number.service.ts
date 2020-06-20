import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatNumberService {

  constructor() { }

  private formatPart(value: string): string {
    let res = [];
    let i = value.length - 3;
    for (; i > 0; i -= 3) {
      res.push(value.substr(i, 3));
    }
    i += 3;
    res.push(value.substr(0, i));
    return `${res.reverse().join(',')}`;
  }

  formatNumber(value: number): string {
    if (isNaN(value)) { return ''; }
    const minus = value < 0 ? '-' : '';
    let temp = Math.abs(value).toString().split('.');
    const res = [];
    temp.forEach(str => {
      res.push(this.formatPart(str));
    });
    return `${minus}${res.join('.')}`;
  }
}
