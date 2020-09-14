import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'md-step3-header',
  templateUrl: './step3-header.component.html',
  styleUrls: ['./step3-header.component.scss']
})
export class Step3HeaderComponent implements OnInit {

  @Input() headerName: string;
  @Input() toolTipText: string;
  @Input() notice: string;
  @Output() onStateChange = new EventEmitter();

  open(event: any): void {
    this.onStateChange.emit();
  }

  constructor() { }

  ngOnInit() {
  }

}
