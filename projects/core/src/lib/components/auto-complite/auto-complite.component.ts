import { Component, Input, TemplateRef, EventEmitter, Output, ViewContainerRef, ContentChild, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'mdc-auto-complite',
  templateUrl: './auto-complite.component.html',
  styleUrls: ['./auto-complite.component.css']
})
export class AutoCompliteComponent {

  @ViewChild('conteiner', { static: true }) conteiner: ElementRef;
  inputText: string = '';
  @ContentChild(TemplateRef, { read: TemplateRef, static: true }) template: TemplateRef<any>;
  @Output() completeMethod = new EventEmitter<string>();
  @Input() set suggestions(suggestions: Array<any>) {
    this.currentIndex = -1;
    this._suggestions = suggestions;
  }
  @Input() placeHolder = 'Search...';
  @Input() set minLength(minLength: number) { this._minLength = Math.max(1, minLength); }
  @Input() textField = '';
  @Output() onSelect = new EventEmitter<any>();
  @Input()dropdown = true;

  get suggestions(): Array<any> { return this._suggestions; }
  get minLength(): number { return this._minLength; }
  private _minLength = 3;
  currentIndex = -1;
  isSelected = false;
  private _suggestions: Array<any>;
  selectOpen = false;
  isOver = false;

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.isSelected = true;
    this.selectOpen = false;
  }

  search(event: any): void {
    if (event.keyCode === 13) { return; }
    if (event.keyCode === 38) { return; }
    if (event.keyCode === 40) { return; }

    if (this.inputText.length >= this.minLength) {
      this.completeMethod.emit(this.inputText);
    }
  }

  openSelect(): void {
    this.completeMethod.emit('');
    this.selectOpen = true;
  }

  inputBlur(): void {
  }

  selectItem(index: number): void {
    this.currentIndex = -1;
    this.selectOpen = false;
    this.isSelected = true;
    this.inputText = this.suggestions[index][this.textField];
    this.onSelect.emit(this.suggestions[index]);
  }

  get isHiddeSuggestions(): boolean {
    if (this.selectOpen) {
      return false;
    }
    return !this.suggestions ||
      !this.suggestions.length ||
      this.isSelected ||
      !this.inputText.trim();
  }

  private moveUp(): void {
    if (this.currentIndex === -1) {
      this.currentIndex = this.suggestions.length - 1;
    } else {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.suggestions.length - 1;
      }
    }
    this.moveToView();
  }

  private moveDown(): void {
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
      if (this.currentIndex === this.suggestions.length) {
        this.currentIndex = 0;
      }
    }
    this.moveToView();
  }

  private moveToView(): void {
    if (this.currentIndex < 2) {
      this.conteiner.nativeElement.scrollTop = 0;
      return;
    }
    const element = this.conteiner.nativeElement.childNodes[this.currentIndex];
    if (element.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }

  onKeyDown(event: any): void {
    this.isSelected = false;
    if (!this.suggestions || !this.suggestions.length) {
      return;
    }
    if (event.keyCode === 13) {
      event.stopPropagation();
      this.isSelected = true;
      this.selectOpen = false;
      this.inputText = this.suggestions[this.currentIndex][this.textField];
      this.onSelect.emit(this.suggestions[this.currentIndex]);
    }
    if (event.keyCode === 38) {
      event.stopPropagation();
      this.moveUp();
    }
    if (event.keyCode === 40) {
      event.stopPropagation();
      this.moveDown();
    }
  }
}
