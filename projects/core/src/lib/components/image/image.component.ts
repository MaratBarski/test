import { Component, Input } from '@angular/core';

export const IMAGE_PATH = './assets/images/';
@Component({
  selector: 'mdc-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {
  private _src: string;
  @Input() set src(src: string) {
    this._src = src;
  }
  get src(): string { return this._src; }
  get imageSrc(): string {
    return `${IMAGE_PATH}${this.src}`;
  }
}
