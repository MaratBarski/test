import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TooltipPosition } from '../../directives/tooltip.directive';

@Component({
  selector: 'mdc-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.css']
})
export class TextBlockComponent {

  @Input() textOverflow = 'ellipsis';
  @Input() overflow = 'hidden';
  @Input() whiteSpace = 'nowrap'
  @Input() position: TooltipPosition = 'right';
  @Input() maxWidth = 200;
  @Input() set text(text: string) {
    this._text = text;
    this.setView();
  }
  get text(): string { return this._text; }
  private _text = '';

  isEllipsis = false;

  @ViewChild('container', { static: true }) container: ElementRef;

  private setView(): void {
    setTimeout(() => {
      this.isEllipsis = (this.container.nativeElement.scrollWidth > this.container.nativeElement.offsetWidth);
    }, 100);
  }

}
