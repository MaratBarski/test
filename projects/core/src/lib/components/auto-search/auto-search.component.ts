import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'mdc-auto-search',
  templateUrl: './auto-search.component.html',
  styleUrls: ['./auto-search.component.css']
})
export class AutoSearchComponent implements OnDestroy {

  @Output() complete = new EventEmitter<string>();
  @Input() minLength = 3;
  @Input() placeholder = '';
  @Input() pause = 500;
  prevText = '';
  text = '';
  timeoutID: any;

  keyup(event: any): void {
    if (this.prevText === this.text) { return; }
    if (this.text.length < this.minLength && this.text != '') { return; }
    this.prevText = this.text;
    this.publish();
  }

  keydown(event: any): void {
    this.stopTimeout();
    if (event.keyCode !== 13) { return; }
    this.complete.emit(this.text);
  }

  publish(): void {
    this.stopTimeout();
    this.timeoutID = setTimeout(() => {
      this.stopTimeout();
      this.complete.emit(this.text);
    }, this.pause);
  }

  search(): void {
    this.stopTimeout();
    this.complete.emit(this.text);
  }

  clearText(): void {
    if (this.text.length) {
      this.prevText = this.text;
      this.text = '';
      this.publish();
    }
  }

  ngOnDestroy(): void {
    this.stopTimeout();
  }
  
  private stopTimeout(): void {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

}
