import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdcColorText]'
})
export class ColorTextDirective {

  @Input() set color(color: string) {
    this._color = color;
    this.create();
  }
  get color(): string {
    return this._color;
  }
  private _color = '#15D2A9';

  @Input() set mdcColorText(mdcColorText: string) {
    this._mdcColorText = mdcColorText;
    this.create();
  }
  get mdcColorText(): string {
    return this._mdcColorText;
  }
  private _mdcColorText = '';

  @Input() set text(text: string) {
    this._text = text;
    this.create();
  }
  get text(): string {
    return this._text;
  }
  private _text = '';
  constructor(
    private element: ElementRef
  ) { }

  private create(): void {
    if (!this.element) { return; }
    if (!this.mdcColorText) {
      this.element.nativeElement.innerHTML = this.text;
      return;
    }
    let index = this.text.toLowerCase().indexOf(this.mdcColorText.toLowerCase());
    if (index === -1) {
      this.element.nativeElement.innerHTML = this.text;
      return;
    }
    this.element.nativeElement.innerHTML = this.text.replace(
      new RegExp(this.mdcColorText, 'gi'),
      `<span style='color:${this.color}'>${this.text.substr(index, this.mdcColorText.length)}</span>`
    );

    //const r = new RegExp(this.mdcColorText, 'gi');
    //this.element.nativeElement.innerHTML = this.text.replace(r,`<span style='color:${this.color}'>${this.mdcColorText}</span>`);
  }
}
