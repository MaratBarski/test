import { Directive, Input, ElementRef, ViewContainerRef, OnInit } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
  selector: '[mdToolTipManager]'
})
export class ToolTipManagerDirective implements OnInit {

  constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set maxWidth(maxWidth: number) {
    this._maxWidth = Math.max(0, maxWidth);
  }

  ngOnInit(): void {
    // const tt: Tooltip = new Tooltip(this.element, undefined);
    // tt.tooltipText = 'rtrtretr';
  }

  private _maxWidth = 50;

}

