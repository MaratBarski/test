import { Directive, ViewContainerRef, Renderer2, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[mdcTable]'
})
export class TableDirective implements AfterViewInit {

  constructor(private ref: ViewContainerRef, private renderer: Renderer2) { }
  ngAfterViewInit(): void {
    this.renderer.addClass(this.ref.element.nativeElement, 'admin-table');
    this.renderer.addClass(this.ref.element.nativeElement, 'admin-table_auto');    
  }
}

@Directive({
  selector: '[mdcTableHeader]'
})
export class TableHeaderDirective implements AfterViewInit {
  constructor(private ref: ViewContainerRef, private renderer: Renderer2) { }
  ngAfterViewInit(): void {
    this.renderer.addClass(this.ref.element.nativeElement, 'admin-table__head');
  }
}


@Directive({
  selector: '[mdcTableItem]'
})
export class TableItemDirective implements AfterViewInit {
  @Input('mdcTableItem') index = 0;
  constructor(private ref: ViewContainerRef, private renderer: Renderer2) { }
  ngAfterViewInit(): void {
    // this.renderer.addClass(this.ref.element.nativeElement, 'admin-table__item');
    // if (this.index > 0) {
    //   this.renderer.addClass(this.ref.element.nativeElement, 'd-none');
    //   this.renderer.addClass(this.ref.element.nativeElement, 'd-md-table-cell');
    // }
  }
}

@Directive({
  selector: '[mdcTableRow]'
})
export class TableRowDirective implements AfterViewInit {
  constructor(private ref: ViewContainerRef, private renderer: Renderer2) { }
  ngAfterViewInit(): void {
    this.renderer.addClass(this.ref.element.nativeElement, 'admin-table__row');
  }
}

