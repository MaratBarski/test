import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mdc-auto-search',
  templateUrl: './auto-search.component.html',
  styleUrls: ['./auto-search.component.css']
})
export class AutoSearchComponent {

  @Output() complite = new EventEmitter<string>();
  @Input() minLength = 3;
  @Input() placeholder = '';
  @Input() pause = 2000;
  prevText: string;
  text: string;
  timeoutID: any;

  keyup(event: any): void {
    if (!this.text) { this.publish(); return; }
    if (this.text.length < this.minLength) { return; }
    if (this.prevText === this.text) { return; }
    this.prevText = this.text;
    this.publish();
  }

  keydown(event: any): void {
    this.stopTimeout();
    if (event.keyCode !== 13) { return; }
    this.complite.emit(this.text); 
  }

  publish(): void {
    this.stopTimeout();
    this.timeoutID = setTimeout(() => {
      this.stopTimeout();
      this.complite.emit(this.text);
    }, this.pause);
  }

  private stopTimeout(): void {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

}