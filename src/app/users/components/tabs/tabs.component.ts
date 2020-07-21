import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Output() onSelect = new EventEmitter<number>();

  constructor() { }

  @Input() selectedTabb = 0;
  
  select(i: number): void {
    this.selectedTabb = i;
    this.onSelect.emit(i);
  }

  ngOnInit() {
  }

}
