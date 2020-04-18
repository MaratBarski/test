import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[mdcSvg]'
})
export class SvgDirective implements OnInit {

  @Input('mdcSvg') set path(path: string) {
    this._path = path;
    this.init();
  }
  get path(): string {
    return this._path ? `xlink:href="#${this._path}"` : '';
  }
  private _path: string;

  @Input('color') set color(color: string) {
    this._color = color;
    this.init();
  }
  get color(): string {
    return this._color ? `fill="${this._color}"` : '';
  }
  private _color: string;

  constructor(
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    //this.init();
  }

  private init(): void {
    this.elementRef.nativeElement.innerHTML = `<use fill-rule="evenodd" ${this.path} ${this.color} />`;
  }
}
