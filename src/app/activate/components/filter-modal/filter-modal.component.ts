import {Component, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {IColumn} from '@app/activate/model/interfaces/IColumn';

@Component({
  selector: 'md-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  @Output() closeWindow: Subject<boolean> = new Subject<boolean>();
  @Input() collection: Array<IColumn>;
  constructor() {
  }

  ngOnInit() {
  }

  closeMe() {
    this.closeWindow.next(true);
  }

}
