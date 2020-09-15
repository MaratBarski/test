import {Component, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'md-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  @Output() closeWindow: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  closeMe() {
    this.closeWindow.next(true);
  }

}
