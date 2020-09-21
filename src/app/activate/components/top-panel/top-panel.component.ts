import {Component, Input, OnInit, Output} from '@angular/core';
import {FileSource} from '@app/models/file-source';
import {Subject} from 'rxjs';

@Component({
  selector: 'md-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent implements OnInit {
  @Input() fileSource: FileSource;
  @Output() saveFileStateState: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  ngOnInit() {
  }

  saveState() {
    this.saveFileStateState.next(true);
  }
}
