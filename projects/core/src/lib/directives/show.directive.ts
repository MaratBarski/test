import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mdcShow]'
})
export class ShowDirective {

  get display(): string {
    return this._show ? '' : 'none'
  }
  private _show = true;
  @Input('mdcShow') set show(show: boolean) {
    this._show = show;
    this.apply()
  }
  
  get show(): boolean { return this._show; }

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  private apply(): void {
    this.renderer.setStyle(this.element.nativeElement, 'display', this.display);
  }
}
