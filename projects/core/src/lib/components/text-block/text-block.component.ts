import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TooltipPosition } from '../../directives/tooltip.directive';
import { ComponentService } from '../../services/component.service';
import { BaseSibscriber } from '../../common/BaseSibscriber';

@Component({
  selector: 'mdc-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.css']
})
export class TextBlockComponent extends BaseSibscriber {

  @Input() textOverflow = 'ellipsis';
  @Input() overflow = 'hidden';
  @Input() whiteSpace = 'nowrap'
  @Input() position: TooltipPosition = 'right';

  @Input() set maxWidth(maxWidth: number) {
    if (maxWidth >= 0) {
      this._maxWidth = maxWidth;
      this._originalMaxWidth = maxWidth;
    }
  }

  get maxWidth(): number {
    return this._maxWidth;
  }
  private _maxWidth = 200;
  private _originalMaxWidth = 200;

  @Input() set text(text: string) {
    this._text = text;
    this.setView();
  }
  get text(): string { return this._text; }
  private _text = '';

  isEllipsis = false;

  @ViewChild('container', { static: true }) container: ElementRef;

  constructor(public componentService: ComponentService) {
    super();
    // super.add(this.componentService.onToggleMenu.subscribe(isShow => {
    //   if (!this.container) { return; }
    //   if (isShow) {
    //     this._maxWidth = this._originalMaxWidth;
    //     this.setView();
    //   } else {
    //     setTimeout(() => {
    //       const w = ComponentService.getRect(this.container.nativeElement.parentNode).width;
    //       this._maxWidth = w;
    //       this.setView();
    //     }, 100);
    //   }
    // }));
  }

  private setView(): void {
    setTimeout(() => {
      this.isEllipsis = (this.container.nativeElement.scrollWidth > this.container.nativeElement.offsetWidth);
    }, 100);
  }

}
